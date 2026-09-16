"use client";

import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Insumo } from "@/components/cmv/types";
import {
  calcularCmv,
  classificarCmv,
  precoSugerido,
  NIVEL_CLASSES,
  NIVEL_LABEL,
  type CmvConfig,
} from "@/components/cmv/calculations";

export type ReceitaItem = {
  insumo_id: string;
  quantidade: number;
  nome?: string;
  unidade?: string;
  custo_unitario?: number;
};

type RecipeBuilderProps = {
  action: (formData: FormData) => void;
  insumos: Insumo[];
  cmvConfig: CmvConfig;
  initial?: {
    nome: string;
    descricao: string | null;
    publica: boolean;
    preco_venda_sugerido: number | null;
  };
  initialItems?: ReceitaItem[];
  error?: string;
  readOnly?: boolean;
};

function InsumoChip({ insumo, onAdd }: { insumo: Insumo; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `insumo-${insumo.id}`,
    data: { insumo },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onAdd}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      className={`border-line bg-ink text-paper w-full cursor-grab touch-none rounded-sm border px-3 py-2 text-left text-sm active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {insumo.nome} <span className="text-smoke text-xs">({insumo.unidade})</span>
    </button>
  );
}

export function RecipeBuilder({
  action,
  insumos,
  cmvConfig,
  initial,
  initialItems,
  error,
  readOnly,
}: RecipeBuilderProps) {
  const [items, setItems] = useState<ReceitaItem[]>(initialItems ?? []);
  const [busca, setBusca] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: "dropzone" });

  function addItem(insumoId: string) {
    setItems((prev) => {
      if (prev.some((i) => i.insumo_id === insumoId)) return prev;
      return [...prev, { insumo_id: insumoId, quantidade: 0.1 }];
    });
  }

  function updateQuantidade(insumoId: string, quantidade: number) {
    setItems((prev) => prev.map((i) => (i.insumo_id === insumoId ? { ...i, quantidade } : i)));
  }

  function removeItem(insumoId: string) {
    setItems((prev) => prev.filter((i) => i.insumo_id !== insumoId));
  }

  function handleDragEnd(e: DragEndEvent) {
    if (e.over?.id === "dropzone") {
      const insumoId = String(e.active.id).replace("insumo-", "");
      addItem(insumoId);
    }
  }

  const insumosFiltrados = useMemo(
    () => insumos.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase())),
    [insumos, busca]
  );

  function itemInfo(item: ReceitaItem) {
    if (item.nome !== undefined) {
      return { nome: item.nome, unidade: item.unidade ?? "", custoUnitario: item.custo_unitario ?? 0 };
    }
    const insumo = insumos.find((i) => i.id === item.insumo_id);
    return insumo
      ? { nome: insumo.nome, unidade: insumo.unidade, custoUnitario: insumo.custo_unitario }
      : { nome: "Insumo", unidade: "", custoUnitario: 0 };
  }

  const custoTotal = useMemo(
    () => items.reduce((soma, item) => soma + itemInfo(item).custoUnitario * item.quantidade, 0),
    [items, insumos]
  );

  const [precoVenda, setPrecoVenda] = useState(initial?.preco_venda_sugerido ?? 0);
  const cmv = precoVenda > 0 ? calcularCmv(custoTotal, precoVenda) : null;
  const nivel = cmv !== null ? classificarCmv(cmv, cmvConfig) : null;
  const sugerido = precoSugerido(custoTotal, cmvConfig.cmv_alvo);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <form ref={formRef} action={action}>
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        {error && <p className="border-rosso text-rosso mb-4 rounded-sm border px-4 py-3 text-sm">{error}</p>}

        <div className="grid gap-6 md:grid-cols-[1fr_1.3fr]">
          {!readOnly && (
            <div>
              <p className="text-smoke text-sm">Seus insumos — toque ou arraste para adicionar</p>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar insumo..."
                className="border-line bg-char text-paper mt-2 w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
              />
              <div className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
                {insumosFiltrados.map((insumo) => (
                  <InsumoChip key={insumo.id} insumo={insumo} onAdd={() => addItem(insumo.id)} />
                ))}
                {insumosFiltrados.length === 0 && (
                  <p className="text-smoke text-xs">Nenhum insumo encontrado.</p>
                )}
              </div>
            </div>
          )}

          <div>
            <div>
              <label className="text-smoke text-sm">Nome da receita</label>
              <input
                name="nome"
                required
                defaultValue={initial?.nome}
                disabled={readOnly}
                placeholder="Ex: Pizza Margherita"
                className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso disabled:opacity-70"
              />
            </div>

            <div className="mt-3">
              <label className="text-smoke text-sm">Descrição (opcional)</label>
              <textarea
                name="descricao"
                rows={2}
                defaultValue={initial?.descricao ?? ""}
                disabled={readOnly}
                className="border-line bg-char text-paper mt-1 w-full resize-none rounded-sm border px-3 py-2 outline-none focus:border-rosso disabled:opacity-70"
              />
            </div>

            <div
              ref={setDropRef}
              className={`border-line bg-char mt-4 min-h-[140px] rounded-sm border-2 border-dashed p-3 transition-colors ${
                isOver ? "border-rosso" : ""
              }`}
            >
              {items.length === 0 && (
                <p className="text-smoke py-8 text-center text-sm">
                  {readOnly ? "Nenhum ingrediente nesta receita." : "Arraste insumos aqui, ou toque neles ao lado."}
                </p>
              )}
              <div className="space-y-2">
                {items.map((item) => {
                  const info = itemInfo(item);
                  return (
                    <div key={item.insumo_id} className="border-line flex items-center gap-2 rounded-sm border p-2">
                      <span className="text-paper flex-1 text-sm">{info.nome}</span>
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={item.quantidade}
                        disabled={readOnly}
                        onChange={(e) => updateQuantidade(item.insumo_id, Number(e.target.value))}
                        className="border-line bg-ink text-paper w-24 rounded-sm border px-2 py-1 text-sm outline-none focus:border-rosso disabled:opacity-70"
                      />
                      <span className="text-smoke w-10 text-xs">{info.unidade}</span>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.insumo_id)}
                          className="text-rosso text-xs underline underline-offset-2"
                        >
                          remover
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-line bg-char mt-4 rounded-sm border p-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-smoke text-xs">Custo total (calculado)</p>
                  <p className="font-display text-oro text-2xl">R$ {custoTotal.toFixed(2)}</p>
                  <p className="text-smoke mt-1 text-xs">
                    Preço sugerido (CMV alvo {(cmvConfig.cmv_alvo * 100).toFixed(0)}%): R$ {sugerido.toFixed(2)}
                  </p>
                </div>
                <div className="w-40">
                  <label className="text-smoke text-xs">Preço de venda (opcional)</label>
                  <input
                    name="preco_venda_sugerido"
                    type="number"
                    step="0.01"
                    min="0"
                    value={precoVenda || ""}
                    disabled={readOnly}
                    onChange={(e) => setPrecoVenda(Number(e.target.value))}
                    className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-2 py-1 text-sm outline-none focus:border-rosso disabled:opacity-70"
                  />
                </div>
              </div>

              {cmv !== null && nivel && (
                <p className={`mt-3 inline-block rounded-sm border px-3 py-1 text-sm ${NIVEL_CLASSES[nivel]}`}>
                  CMV: {(cmv * 100).toFixed(1)}% — {NIVEL_LABEL[nivel]}
                </p>
              )}
            </div>

            {!readOnly && (
              <div className="mt-4 flex items-center justify-between">
                <label className="text-smoke flex items-center gap-2 text-sm">
                  <input type="checkbox" name="publica" defaultChecked={initial?.publica ?? true} />
                  Compartilhar com a comunidade
                </label>
                <button
                  type="submit"
                  className="font-display bg-rosso text-paper rounded-sm px-6 py-2.5 text-base tracking-wide"
                >
                  Salvar receita
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </DndContext>
  );
}
