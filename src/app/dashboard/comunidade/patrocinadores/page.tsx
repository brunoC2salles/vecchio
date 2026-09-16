import { createClient } from "@/lib/supabase/server";
import { createPatrocinador, deletePatrocinador } from "./actions";

export default async function PatrocinadoresPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const isAdmin = profile?.role === "admin";

  const { data: patrocinadores } = await supabase
    .from("patrocinadores")
    .select("id, nome_marca, logo_url, link")
    .order("nome_marca");

  const { data: perfisPatrocinador } = isAdmin
    ? await supabase.from("profiles").select("id, nome").eq("is_patrocinador", true)
    : { data: null };

  return (
    <div className="space-y-6">
      {error && <p className="border-rosso text-rosso rounded-sm border px-4 py-3 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        {(patrocinadores ?? []).map((p) => (
          <div key={p.id} className="border-line bg-char flex items-center justify-between rounded-sm border p-4">
            <a
              href={p.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper text-sm font-semibold hover:underline"
            >
              {p.nome_marca}
            </a>
            {isAdmin && (
              <form action={deletePatrocinador.bind(null, p.id)}>
                <button type="submit" className="text-rosso text-xs underline underline-offset-2">
                  excluir
                </button>
              </form>
            )}
          </div>
        ))}
        {(patrocinadores ?? []).length === 0 && (
          <p className="text-smoke border-line col-span-2 rounded-sm border px-4 py-6 text-center text-sm">
            Nenhum patrocinador cadastrado ainda.
          </p>
        )}
      </div>

      {isAdmin && (
        <form action={createPatrocinador} className="border-line bg-char space-y-3 rounded-sm border p-4">
          <p className="text-smoke text-xs">Novo patrocinador</p>
          <input
            name="nome_marca"
            required
            placeholder="Nome da marca"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <input
            name="link"
            placeholder="Link (site ou Instagram)"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <input
            name="logo_url"
            placeholder="URL da logo"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          {perfisPatrocinador && perfisPatrocinador.length > 0 && (
            <select
              name="profile_id"
              className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
            >
              <option value="">Sem conta vinculada</option>
              {perfisPatrocinador.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          )}
          <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide">
            Adicionar patrocinador
          </button>
        </form>
      )}
    </div>
  );
}
