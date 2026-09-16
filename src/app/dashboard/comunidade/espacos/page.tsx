import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createEspaco } from "./actions";

export default async function EspacosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: espacos } = await supabase
    .from("espacos")
    .select("id, nome, criado_em")
    .eq("tipo", "tema")
    .order("nome");

  return (
    <div>
      <form action={createEspaco} className="border-line bg-char flex gap-2 rounded-sm border p-4">
        <input
          name="nome"
          required
          placeholder="Nome do novo espaço (ex: Fermentação natural)"
          className="border-line bg-ink text-paper flex-1 rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
        />
        <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide">
          Criar
        </button>
      </form>
      {error && <p className="border-rosso text-rosso mt-3 rounded-sm border px-4 py-3 text-sm">{error}</p>}

      <div className="mt-6 space-y-2">
        {(espacos ?? []).map((e) => (
          <Link
            key={e.id}
            href={`/dashboard/comunidade/espacos/${e.id}`}
            className="border-line bg-char text-paper hover:border-rosso block rounded-sm border p-4 text-sm"
          >
            {e.nome}
          </Link>
        ))}
        {(espacos ?? []).length === 0 && (
          <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
            Nenhum espaço temático criado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
