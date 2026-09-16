import { createClient } from "@/lib/supabase/server";
import { createTurma, updateMatriculaStatus, updateTurmaStatus } from "./actions";

function formatarData(iso: string | null) {
  if (!iso) return "sem data";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default async function TurmasPage() {
  const supabase = await createClient();

  const { data: turmas } = await supabase
    .from("turmas")
    .select(
      "id, nome, tipo, data_evento, status, matriculas ( id, status, codigo_acesso_presencial, comprado_em, profile:profiles ( nome, email ) )"
    )
    .order("criado_em", { ascending: false });

  return (
    <div className="space-y-8">
      {(turmas ?? []).map((turma) => (
        <div key={turma.id} className="border-line bg-char rounded-sm border p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-paper text-xl">{turma.nome}</p>
              <p className="text-smoke mt-1 text-xs">
                {turma.tipo === "presencial_comunidade" ? "Presencial + comunidade" : "Somente comunidade"} ·{" "}
                {formatarData(turma.data_evento)}
              </p>
            </div>
            <form action={updateTurmaStatus.bind(null, turma.id, turma.status === "ativa" ? "encerrada" : "ativa")}>
              <button type="submit" className="text-oro text-xs underline underline-offset-2">
                {turma.status === "ativa" ? "encerrar turma" : "reativar turma"}
              </button>
            </form>
          </div>

          <div className="mt-4 space-y-2">
            {(turma.matriculas ?? []).map((m) => {
              const perfilMatricula = Array.isArray(m.profile) ? m.profile[0] : m.profile;
              return (
              <div key={m.id} className="border-line flex items-center justify-between rounded-sm border p-3 text-sm">
                <div>
                  <p className="text-paper">{perfilMatricula?.nome ?? "—"}</p>
                  <p className="text-smoke text-xs">{perfilMatricula?.email}</p>
                  {m.codigo_acesso_presencial && (
                    <p className="text-oro text-xs">código: {m.codigo_acesso_presencial}</p>
                  )}
                </div>
                <form action={updateMatriculaStatus.bind(null, m.id)} className="flex items-center gap-2">
                  <select
                    name="status"
                    defaultValue={m.status}
                    className="border-line bg-ink text-paper rounded-sm border px-2 py-1 text-xs outline-none focus:border-rosso"
                  >
                    <option value="teste">Teste</option>
                    <option value="pago">Pago</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button type="submit" className="text-oro text-xs underline underline-offset-2">
                    salvar
                  </button>
                </form>
              </div>
              );
            })}
            {(turma.matriculas ?? []).length === 0 && (
              <p className="text-smoke text-xs">Nenhuma matrícula nesta turma ainda.</p>
            )}
          </div>
        </div>
      ))}

      {(turmas ?? []).length === 0 && (
        <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
          Nenhuma turma criada ainda.
        </p>
      )}

      <form action={createTurma} className="border-line bg-char space-y-3 rounded-sm border p-4">
        <p className="text-smoke text-xs">Nova turma</p>
        <input
          name="nome"
          required
          placeholder="Nome da turma (ex: Outubro 2026)"
          className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            name="tipo"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          >
            <option value="presencial_comunidade">Presencial + comunidade</option>
            <option value="somente_comunidade">Somente comunidade</option>
          </select>
          <input
            name="data_evento"
            type="date"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
        </div>
        <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide">
          Criar turma
        </button>
      </form>
    </div>
  );
}
