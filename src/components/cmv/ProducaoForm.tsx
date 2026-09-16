import type { Insumo, ItemLinha } from "@/components/cmv/types";
import { ItemsEditor } from "@/components/cmv/ItemsEditor";

type ProducaoFormProps = {
  action: (formData: FormData) => void;
  insumos: Insumo[];
  producao?: { nome: string; rendimento_qtd: number; rendimento_unidade: string };
  initialItems?: ItemLinha[];
  error?: string;
};

export function ProducaoForm({ action, insumos, producao, initialItems, error }: ProducaoFormProps) {
  return (
    <form action={action} className="border-line bg-char max-w-2xl rounded-sm border p-6">
      {error && <p className="border-rosso text-rosso mb-4 rounded-sm border px-4 py-3 text-sm">{error}</p>}

      <div>
        <label className="text-smoke text-sm">Nome da produção</label>
        <input
          name="nome"
          required
          defaultValue={producao?.nome}
          placeholder="Ex: Molho de tomate base"
          className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="text-smoke text-sm">Rendimento (quantidade)</label>
          <input
            name="rendimento_qtd"
            type="number"
            step="0.001"
            min="0.001"
            required
            defaultValue={producao?.rendimento_qtd}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">Unidade do rendimento</label>
          <input
            name="rendimento_unidade"
            required
            placeholder="kg, l, un..."
            defaultValue={producao?.rendimento_unidade}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-smoke text-sm">Insumos usados</p>
        <div className="mt-2">
          <ItemsEditor insumos={insumos} initialItems={initialItems} fieldName="items" />
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
