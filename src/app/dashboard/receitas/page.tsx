import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ReceitasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: minhas } = await supabase
    .from("receitas")
    .select("id, nome, custo_total, publica")
    .eq("owner_id", user!.id)
    .order("atualizado_em", { ascending: false });

  const { data: daComunidade } = await supabase
    .from("receitas")
    .select("id, nome, custo_total, owner:profiles!receitas_owner_id_fkey(nome)")
    .eq("publica", true)
    .neq("owner_id", user!.id)
    .order("criado_em", { ascending: false })
    .limit(20);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-paper text-4xl">Receitas</h1>
        <Link
          href="/dashboard/receitas/nova"
          className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide"
        >
          Nova receita
        </Link>
      </div>

      <h2 className="font-display text-paper mt-8 text-xl">Minhas receitas</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(minhas ?? []).map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/receitas/${r.id}`}
            className="border-line bg-char hover:border-rosso block rounded-sm border p-4"
          >
            <p className="text-paper text-sm font-semibold">
              {r.nome} {!r.publica && <span className="text-smoke text-xs">(privada)</span>}
            </p>
            <p className="text-smoke mt-1 text-xs">Custo: R$ {Number(r.custo_total).toFixed(2)}</p>
          </Link>
        ))}
        {(minhas ?? []).length === 0 && (
          <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm md:col-span-2">
            Você ainda não criou nenhuma receita.
          </p>
        )}
      </div>

      <h2 className="font-display text-paper mt-10 text-xl">Da comunidade</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(daComunidade ?? []).map((r) => {
          const autor = Array.isArray(r.owner) ? r.owner[0] : r.owner;
          return (
            <Link
              key={r.id}
              href={`/dashboard/receitas/${r.id}`}
              className="border-line bg-char hover:border-rosso block rounded-sm border p-4"
            >
              <p className="text-paper text-sm font-semibold">{r.nome}</p>
              <p className="text-smoke mt-1 text-xs">por {autor?.nome ?? "aluno"}</p>
            </Link>
          );
        })}
        {(daComunidade ?? []).length === 0 && (
          <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm md:col-span-2">
            Nenhuma receita compartilhada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
