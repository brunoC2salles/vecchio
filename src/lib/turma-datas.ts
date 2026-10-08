import { createAdminClient } from "@/lib/supabase/admin";

// Cookie com a data escolhida na página de matrícula (antes do pagamento).
// Serve só para pré-selecionar a opção na criação de senha; a escolha que vale
// é a confirmada pelo aluno logado.
export const COOKIE_DATA_PREFERIDA = "vecchio_data_preferida";

export type TurmaData = {
  id: string;
  rotulo: string;
  data_inicio: string;
  vagas: number;
  ocupadas: number;
  restantes: number;
  lotada: boolean;
};

// Usa a service role porque a contagem de vagas precisa ler matrículas de
// todos os alunos (o visitante anônimo não tem acesso a essa tabela).
export async function listarDatasTurma(turmaId: string): Promise<TurmaData[]> {
  const admin = createAdminClient();

  const { data: datas } = await admin
    .from("turma_datas")
    .select("id, rotulo, data_inicio, vagas")
    .eq("turma_id", turmaId)
    .eq("ativa", true)
    .order("data_inicio", { ascending: true });

  if (!datas || datas.length === 0) return [];

  const { data: ocupacoes } = await admin
    .from("matriculas")
    .select("turma_data_id")
    .in(
      "turma_data_id",
      datas.map((d) => d.id)
    )
    .neq("status", "cancelado");

  return datas.map((d) => {
    const ocupadas = (ocupacoes ?? []).filter((o) => o.turma_data_id === d.id).length;
    const restantes = Math.max(d.vagas - ocupadas, 0);
    return { ...d, ocupadas, restantes, lotada: restantes === 0 };
  });
}

export type MatriculaPendente = {
  matriculaId: string;
  turmaId: string;
  datas: TurmaData[];
};

// Matrícula ativa do aluno, numa turma que tem datas com vaga, ainda sem data escolhida.
export async function buscarMatriculaPendente(profileId: string): Promise<MatriculaPendente | null> {
  const admin = createAdminClient();

  const { data: matriculas } = await admin
    .from("matriculas")
    .select("id, turma_id")
    .eq("profile_id", profileId)
    .is("turma_data_id", null)
    .neq("status", "cancelado");

  for (const m of matriculas ?? []) {
    if (!m.turma_id) continue;
    const datas = await listarDatasTurma(m.turma_id);
    // Se todas as datas lotaram, não há o que o aluno escolher: o admin resolve manualmente.
    if (datas.some((d) => !d.lotada)) {
      return { matriculaId: m.id, turmaId: m.turma_id, datas };
    }
  }

  return null;
}

// Grava a data escolhida pelo aluno. Retorna mensagem de erro ou null.
export async function confirmarDataMatricula(
  profileId: string,
  matriculaId: string,
  turmaDataId: string
): Promise<string | null> {
  const admin = createAdminClient();

  const { data: matricula } = await admin
    .from("matriculas")
    .select("id, turma_id, turma_data_id, profile_id")
    .eq("id", matriculaId)
    .maybeSingle();

  if (!matricula || matricula.profile_id !== profileId) {
    return "Matrícula não encontrada.";
  }

  // Só o admin troca a data depois de escolhida.
  if (matricula.turma_data_id) return null;

  const datas = await listarDatasTurma(matricula.turma_id);
  const escolhida = datas.find((d) => d.id === turmaDataId);

  if (!escolhida) return "Escolha uma das datas disponíveis.";
  if (escolhida.lotada) return `A turma de ${escolhida.rotulo} lotou. Escolha a outra data.`;

  const { error } = await admin
    .from("matriculas")
    .update({ turma_data_id: turmaDataId })
    .eq("id", matriculaId)
    .is("turma_data_id", null);

  if (error) return "Não foi possível salvar a data. Tente novamente.";

  return null;
}
