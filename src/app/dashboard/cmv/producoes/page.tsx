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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-smoke text-sm">
          Receitas base (molhos, massas, etc.) que viram insumo automaticamente para as fichas técnicas.
        </p>
        <Link
          href="/dashboard/cmv/producoes/novo"
          className="font-display bg-rosso text-paper shrink-0 rounded-sm px-5 py-2.5 text-center text-sm tracking-wide sm:py-2"
        >
          Nova produção
        </Link>
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {(producoes ?? []).map((p) => (
          <div key={p.id} className="border-line bg-char rounded-sm border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-paper text-sm">{p.nome}</p>
                <p className="text-smoke text-xs">
                  Rende {p.rendimento_qtd} {p.rendimento_unidade}
                </p>
              </div>
              <p className="text-paper shrink-0 text-sm">R$ {Number(p.custo_total).toFixed(2)}</p>
            </div>
            <p className="text-smoke mt-2 text-xs">Custo por unidade: R$ {Number(p.custo_por_unidade).toFixed(4)}</p>
            <div className="border-line mt-3 flex justify-end gap-5 border-t pt-2">
              <Link href={`/dashboard/cmv/producoes/${p.id}`} className="text-smoke py-1 text-xs underline underline-offset-2">
                editar
              </Link>
              <form action={deleteProducao.bind(null, p.id)}>
                <button type="submit" className="text-rosso py-1 text-xs underline underline-offset-2">
                  excluir
                </button>
              </form>
            </div>
          </div>
        ))}
        {(producoes ?? []).length === 0 && (
          <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
            Nenhuma produção interna cadastrada ainda.
          </p>
        )}
      </div>

      <div className="border-line mt-6 hidden overflow-x-auto rounded-sm border md:block">
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
