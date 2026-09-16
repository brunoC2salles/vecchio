import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProducao } from "./actions";

export default async function ProducoesPage() {
  const supabase = await createClient();
  const { data: producoes } = await supabase
    .from("producoes_internas")
    .select("id, nome, rendimento_qtd, rendimento_unidade, custo_total, custo_por_unidade")
    .order("nome");

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-smoke text-sm">
          Receitas base (molhos, massas, etc.) que viram insumo automaticamente para as fichas técnicas.
        </p>
        <Link
          href="/dashboard/cmv/producoes/novo"
          className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide"
        >
          Nova produção
        </Link>
      </div>

      <div className="border-line mt-6 overflow-x-auto rounded-sm border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-line text-smoke border-b">
              <th className="px-4 py-3 font-normal">Nome</th>
              <th className="px-4 py-3 font-normal">Rendimento</th>
              <th className="px-4 py-3 font-normal">Custo total</th>
              <th className="px-4 py-3 font-normal">Custo por unidade</th>
              <th className="px-4 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {(producoes ?? []).map((p) => (
              <tr key={p.id} className="border-line text-paper border-b last:border-0">
                <td className="px-4 py-3">{p.nome}</td>
                <td className="text-smoke px-4 py-3">
                  {p.rendimento_qtd} {p.rendimento_unidade}
                </td>
                <td className="px-4 py-3">R$ {Number(p.custo_total).toFixed(2)}</td>
                <td className="px-4 py-3">R$ {Number(p.custo_por_unidade).toFixed(4)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/dashboard/cmv/producoes/${p.id}`} className="text-smoke hover:text-paper text-xs underline underline-offset-2">
                      editar
                    </Link>
                    <form action={deleteProducao.bind(null, p.id)}>
                      <button type="submit" className="text-rosso text-xs underline underline-offset-2">
                        excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(producoes ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="text-smoke px-4 py-6 text-center">
                  Nenhuma produção interna cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
