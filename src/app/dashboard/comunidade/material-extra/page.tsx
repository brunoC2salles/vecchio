import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadMaterial, excluirMaterial } from "./actions";
import { ConfirmButton } from "@/components/ConfirmButton";

const BUCKET = "material-extra";

function formatarTamanho(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function MaterialExtraPage({
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

  const { data: materiais } = await supabase
    .from("materiais_extra")
    .select("id, titulo, descricao, arquivo_path, arquivo_nome, tamanho_bytes, criado_em")
    .order("criado_em", { ascending: false });

  const admin = createAdminClient();
  const materiaisComLink = await Promise.all(
    (materiais ?? []).map(async (m) => {
      const { data } = await admin.storage.from(BUCKET).createSignedUrl(m.arquivo_path, 60 * 60);
      return { ...m, url: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="space-y-6">
      {error && <p className="border-rosso text-rosso rounded-sm border px-4 py-3 text-sm">{error}</p>}

      <div className="space-y-4">
        {materiaisComLink.map((m) => (
          <div
            key={m.id}
            className="border-line bg-char flex items-center justify-between gap-4 rounded-sm border p-4"
          >
            <div>
              <p className="text-paper text-sm font-semibold">{m.titulo}</p>
              {m.descricao && <p className="text-smoke mt-1 text-xs">{m.descricao}</p>}
              <p className="text-smoke mt-1 text-xs">
                {m.arquivo_nome} · {formatarTamanho(m.tamanho_bytes)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {m.url ? (
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-oro text-xs underline underline-offset-2"
                >
                  baixar
                </a>
              ) : (
                <span className="text-smoke text-xs">indisponível</span>
              )}
              {isAdmin && (
                <form action={excluirMaterial.bind(null, m.id, m.arquivo_path)}>
                  <ConfirmButton
                    type="submit"
                    confirmMessage="Excluir este material? Não tem volta."
                    className="text-rosso text-xs underline underline-offset-2"
                  >
                    excluir
                  </ConfirmButton>
                </form>
              )}
            </div>
          </div>
        ))}

        {materiaisComLink.length === 0 && (
          <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
            Nenhum material extra por aqui ainda.
          </p>
        )}
      </div>

      {isAdmin && (
        <form
          action={uploadMaterial}
          encType="multipart/form-data"
          className="border-line bg-char space-y-3 rounded-sm border p-4"
        >
          <p className="text-smoke text-xs">Adicionar material (PDF, até 30MB)</p>
          <input
            name="titulo"
            required
            placeholder="Título do material"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <input
            name="descricao"
            placeholder="Descrição (opcional)"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <input name="arquivo" type="file" accept="application/pdf" required className="text-paper text-sm" />
          <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide">
            Enviar material
          </button>
        </form>
      )}
    </div>
  );
}
