import { createClient } from "@/lib/supabase/server";
import { convidarAluno } from "./actions";

export default async function NovoAlunoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const supabase = await createClient();
  const { data: turmas } = await supabase.from("turmas").select("id, nome").eq("status", "ativa").order("nome");

  return (
    <div className="max-w-md">
      <p className="text-smoke text-sm">
        Envia um convite por e-mail. O aluno recebe um link para definir a própria senha e já entra logado.
      </p>

      {error && <p className="border-rosso text-rosso mt-4 rounded-sm border px-4 py-3 text-sm">{error}</p>}
      {ok && (
        <p className="border-line text-paper mt-4 rounded-sm border px-4 py-3 text-sm">
          Convite enviado com sucesso.
        </p>
      )}

      <form action={convidarAluno} className="border-line bg-char mt-6 space-y-4 rounded-sm border p-6">
        <div>
          <label className="text-smoke text-sm">Nome</label>
          <input
            name="nome"
            required
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        {turmas && turmas.length > 0 && (
          <div>
            <label className="text-smoke text-sm">Turma (opcional)</label>
            <select
              name="turma_id"
              className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
            >
              <option value="">Sem turma vinculada</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-6 py-2.5 text-base tracking-wide">
          Enviar convite
        </button>
      </form>
    </div>
  );
}
