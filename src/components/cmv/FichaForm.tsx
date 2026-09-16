import type { Insumo, ItemLinha } from "@/components/cmv/types";
import { ItemsEditor } from "@/components/cmv/ItemsEditor";

type FichaFormProps = {
  action: (formData: FormData) => void;
  insumos: Insumo[];
  ficha?: {
    nome: string;
    quantas_pecas: number;
    preco_venda_normal: number;
    preco_venda_ifood: number | null;
    custo_embalagem: number;
    perc_imposto: number;
    perc_comissao_ifood: number;
  };
  initialItems?: ItemLinha[];
  error?: string;
};

export function FichaForm({ action, insumos, ficha, initialItems, error }: FichaFormProps) {
  return (
    <form action={action} className="border-line bg-char max-w-2xl rounded-sm border p-6">
      {error && <p className="border-rosso text-rosso mb-4 rounded-sm border px-4 py-3 text-sm">{error}</p>}

      <div>
        <label className="text-smoke text-sm">Nome da ficha</label>
        <input
          name="nome"
          required
          defaultValue={ficha?.nome}
          placeholder="Ex: Pizza Margherita"
          className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
        />
      </div>

      <div className="mt-4">
        <label className="text-smoke text-sm">Quantas peças rende</label>
        <input
          name="quantas_pecas"
          type="number"
          min="1"
          required
          defaultValue={ficha?.quantas_pecas ?? 1}
          className="border-line bg-ink mt-1 w-32 rounded-sm border px-3 py-2 text-paper outline-none focus:border-rosso"
        />
      </div>

      <div className="mt-6">
        <p className="text-smoke text-sm">Insumos usados</p>
        <div className="mt-2">
          <ItemsEditor insumos={insumos} initialItems={initialItems} fieldName="items" />
        </div>
      </div>

      <div className="border-line mt-6 grid grid-cols-2 gap-4 border-t pt-6">
        <div>
          <label className="text-smoke text-sm">Preço de venda normal (R$)</label>
          <input
            name="preco_venda_normal"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={ficha?.preco_venda_normal}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">Preço de venda iFood (R$)</label>
          <input
            name="preco_venda_ifood"
            type="number"
            step="0.01"
            min="0"
            defaultValue={ficha?.preco_venda_ifood ?? ""}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">Custo de embalagem (R$)</label>
          <input
            name="custo_embalagem"
            type="number"
            step="0.01"
            min="0"
            defaultValue={ficha?.custo_embalagem ?? 0}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">Imposto (%)</label>
          <input
            name="perc_imposto"
            type="number"
            step="0.01"
            min="0"
            max="1"
            placeholder="0.06 = 6%"
            defaultValue={ficha?.perc_imposto ?? 0}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">Comissão iFood (%)</label>
          <input
            name="perc_comissao_ifood"
            type="number"
            step="0.01"
            min="0"
            max="1"
            placeholder="0.27 = 27%"
            defaultValue={ficha?.perc_comissao_ifood ?? 0}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
      </div>

      <button
        type="submit"
        className="font-display bg-rosso text-paper mt-6 rounded-sm px-6 py-2.5 text-base tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
      >
        Salvar
      </button>
    </form>
  );
}
