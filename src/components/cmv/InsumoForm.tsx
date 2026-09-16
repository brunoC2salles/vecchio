import type { Insumo } from "@/components/cmv/types";

type InsumoFormProps = {
  action: (formData: FormData) => void;
  insumo?: Insumo;
  error?: string;
};

export function InsumoForm({ action, insumo, error }: InsumoFormProps) {
  return (
    <form action={action} className="border-line bg-char max-w-lg rounded-sm border p-6">
      {error && <p className="border-rosso text-rosso mb-4 rounded-sm border px-4 py-3 text-sm">{error}</p>}

      <div className="grid gap-4">
        <div>
          <label className="text-smoke text-sm">Nome</label>
          <input
            name="nome"
            required
            defaultValue={insumo?.nome}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-smoke text-sm">Categoria</label>
            <input
              name="categoria"
              defaultValue={insumo?.categoria ?? ""}
              className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
            />
          </div>
          <div>
            <label className="text-smoke text-sm">Unidade</label>
            <input
              name="unidade"
              required
              placeholder="kg, un, l..."
              defaultValue={insumo?.unidade}
              className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-smoke text-sm">Preço de compra (R$)</label>
            <input
              name="preco_compra"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={insumo?.preco_compra}
              className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
            />
          </div>
          <div>
            <label className="text-smoke text-sm">Rendimento (0–1)</label>
            <input
              name="rendimento"
              type="number"
              step="0.01"
              min="0.01"
              max="1"
              defaultValue={insumo?.rendimento ?? 1}
              className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
            />
            <p className="text-smoke mt-1 text-xs">Parte aproveitável após perdas. 1 = sem perda.</p>
          </div>
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
