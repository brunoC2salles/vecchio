import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buscarMatriculaPendente, COOKIE_DATA_PREFERIDA } from "@/lib/turma-datas";
import { EscolhaDataTurma } from "@/components/EscolhaDataTurma";
import { escolherData } from "./actions";

// Para alunos que já tinham conta (não passam pela criação de senha)
// e ainda não escolheram a data da turma presencial.
export default async function EscolherDataPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/escolher-data");
  }

  const pendente = await buscarMatriculaPendente(user.id);
  if (!pendente) {
    redirect("/dashboard");
  }

  const preSelecionada = (await cookies()).get(COOKIE_DATA_PREFERIDA)?.value ?? null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/img/logo.png" alt="Vecchio School" width={80} height={80} className="h-16 w-auto" />
        </div>

        <h1 className="font-display text-paper mt-8 text-center text-3xl">Confirme sua turma</h1>
        <p className="text-smoke mt-2 text-center text-sm">
          Escolha em qual data você vai fazer o curso presencial.
        </p>

        {error && (
          <p className="border-rosso text-rosso mt-6 rounded-sm border px-4 py-3 text-sm">{error}</p>
        )}

        <form action={escolherData} className="mt-8 space-y-6">
          <input type="hidden" name="matricula_id" value={pendente.matriculaId} />
          <EscolhaDataTurma datas={pendente.datas} preSelecionada={preSelecionada} />
          <button
            type="submit"
            className="font-display bg-rosso text-paper w-full rounded-sm px-6 py-3 text-lg tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
          >
            Confirmar data
          </button>
        </form>
      </div>
    </main>
  );
}
