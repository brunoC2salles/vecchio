import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteInsumo } from "./actions";

export default async function InsumosPage() {
  const supabase = await createClient();
  const { data: insumos } = await supabase
    .from("insumos")
    .select("id, nome, categoria, tipo, unidade, preco_compra, rendimento, custo_unitario")
    .order("nome");

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-smoke text-sm">
          Insumos base e produções internas (mescladas automaticamente aqui).
        </p>
        <Link
          href="/dashboard/cmv/insumos/novo"
          className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide"
        >
          Novo insumo
        </Link>
      </div>

      <div className="border-line mt-6 overflow-x-auto rounded-sm border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-line text-smoke border-b">
              <th className="px-4 py-3 font-normal">Nome</th>
              <th className="px-4 py-3 font-normal">Categoria</th>
              <th className="px-4 py-3 font-normal">Unidade</th>
              <th className="px-4 py-3 font-normal">Preço compra</th>
              <th className="px-4 py-3 font-normal">Rendimento</th>
              <th className="px-4 py-3 font-normal">Custo unitário</th>
              <th className="px-4 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {(insumos ?? []).map((i) => (
              <tr key={i.id} className="border-line text-paper border-b last:border-0">
                <td className="px-4 py-3">
                  {i.nome}
                  {i.tipo === "producao_interna" && (
                    <span className="text-oro ml-2 text-xs">produção interna</span>
                  )}
                </td>
                <td className="text-smoke px-4 py-3">{i.categoria ?? "—"}</td>
                <td className="text-smoke px-4 py-3">{i.unidade}</td>
                <td className="px-4 py-3">R$ {Number(i.preco_compra).toFixed(2)}</td>
                <td className="px-4 py-3">{(Number(i.rendimento) * 100).toFixed(0)}%</td>
                <td className="px-4 py-3">R$ {Number(i.custo_unitario).toFixed(4)}</td>
                <td className="px-4 py-3 text-right">
                  {i.tipo === "base" && (
                    <div className="flex justify-end gap-3">
                      <Link href={`/dashboard/cmv/insumos/${i.id}`} className="text-smoke hover:text-paper text-xs underline underline-offset-2">
                        editar
                      </Link>
                      <form action={deleteInsumo.bind(null, i.id)}>
                        <button type="submit" className="text-rosso text-xs underline underline-offset-2">
                          excluir
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {(insumos ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="text-smoke px-4 py-6 text-center">
                  Nenhum insumo cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
