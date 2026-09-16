import { createClient } from "@/lib/supabase/server";
import { toEmbedUrl } from "@/components/comunidade/embed";
import { createAula, createSala, deleteAula, deleteSala } from "./actions";

export default async function AulasPage({
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

  const { data: salas } = await supabase
    .from("salas_de_aula")
    .select("id, nome, descricao, ordem, aulas ( id, titulo, url_video, ordem )")
    .order("ordem");

  return (
    <div className="space-y-8">
      {error && <p className="border-rosso text-rosso rounded-sm border px-4 py-3 text-sm">{error}</p>}

      {(salas ?? []).map((sala) => (
        <div key={sala.id}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-paper text-2xl">{sala.nome}</h2>
              {sala.descricao && <p className="text-smoke mt-1 text-sm">{sala.descricao}</p>}
            </div>
            {isAdmin && (
              <form action={deleteSala.bind(null, sala.id)}>
                <button type="submit" className="text-rosso text-xs underline underline-offset-2">
                  excluir sala
                </button>
              </form>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {(sala.aulas ?? [])
              .sort((a, b) => a.ordem - b.ordem)
              .map((aula) => {
                const embedUrl = toEmbedUrl(aula.url_video);
                return (
                  <div key={aula.id} className="border-line bg-char rounded-sm border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-paper text-sm font-semibold">{aula.titulo}</p>
                      {isAdmin && (
                        <form action={deleteAula.bind(null, aula.id)}>
                          <button type="submit" className="text-rosso text-xs underline underline-offset-2">
                            excluir
                          </button>
                        </form>
                      )}
                    </div>
                    {embedUrl ? (
                      <div className="mt-3 aspect-video w-full overflow-hidden rounded-sm">
                        <iframe
                          src={embedUrl}
                          title={aula.titulo}
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      </div>
                    ) : (
                      <p className="text-smoke mt-2 text-xs">Link de vídeo não reconhecido (use YouTube ou Vimeo).</p>
                    )}
                  </div>
                );
              })}
          </div>

          {isAdmin && (
            <form action={createAula} className="border-line bg-char mt-4 space-y-3 rounded-sm border p-4">
              <input type="hidden" name="sala_id" value={sala.id} />
              <p className="text-smoke text-xs">Adicionar aula nesta sala</p>
              <input
                name="titulo"
                required
                placeholder="Título da aula"
                className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
              />
              <input
                name="url_video"
                required
                placeholder="Link do YouTube ou Vimeo"
                className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
              />
              <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide">
                Adicionar aula
              </button>
            </form>
          )}
        </div>
      ))}

      {(salas ?? []).length === 0 && (
        <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
          Nenhuma sala de aula criada ainda.
        </p>
      )}

      {isAdmin && (
        <form action={createSala} className="border-line bg-char space-y-3 rounded-sm border p-4">
          <p className="text-smoke text-xs">Nova sala de aula</p>
          <input
            name="nome"
            required
            placeholder="Nome da sala (ex: Módulo 1 — Fundamentos)"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <input
            name="descricao"
            placeholder="Descrição (opcional)"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide">
            Criar sala
          </button>
        </form>
      )}
    </div>
  );
}
