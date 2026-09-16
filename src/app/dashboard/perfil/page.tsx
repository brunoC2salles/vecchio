import { createClient } from "@/lib/supabase/server";
import { PerfilForm } from "./PerfilForm";
import { changePassword } from "./actions";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string; senha_ok?: string }>;
}) {
  const { error, ok, senha_ok } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, telefone, bio, avatar_url")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="font-display text-paper text-4xl">Meu perfil</h1>

      {error && (
        <p className="border-rosso text-rosso mt-6 max-w-md rounded-sm border px-4 py-3 text-sm">{error}</p>
      )}
      {ok && (
        <p className="border-line text-paper mt-6 max-w-md rounded-sm border px-4 py-3 text-sm">
          Perfil atualizado.
        </p>
      )}
      {senha_ok && (
        <p className="border-line text-paper mt-6 max-w-md rounded-sm border px-4 py-3 text-sm">
          Senha atualizada.
        </p>
      )}

      <div className="mt-6">
        <PerfilForm
          nome={profile?.nome ?? ""}
          telefone={profile?.telefone ?? ""}
          bio={profile?.bio ?? ""}
          avatarAtual={profile?.avatar_url ?? null}
        />
      </div>

      <div className="mt-8 max-w-md">
        <h2 className="font-display text-paper text-xl">Alterar senha</h2>
        <form action={changePassword} className="border-line bg-char mt-3 space-y-3 rounded-sm border p-6">
          <div>
            <label className="text-smoke text-sm">Nova senha</label>
            <input
              name="senha"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
            />
          </div>
          <div>
            <label className="text-smoke text-sm">Confirmar senha</label>
            <input
              name="confirmar"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
            />
          </div>
          <button
            type="submit"
            className="font-display bg-rosso text-paper rounded-sm px-6 py-2.5 text-base tracking-wide"
          >
            Atualizar senha
          </button>
        </form>
      </div>
    </div>
  );
}
