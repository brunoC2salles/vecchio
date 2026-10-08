import Image from "next/image";
import { cookies } from "next/headers";
import { setPassword } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { buscarMatriculaPendente, COOKIE_DATA_PREFERIDA } from "@/lib/turma-datas";
import { EscolhaDataTurma } from "@/components/EscolhaDataTurma";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pendente = user ? await buscarMatriculaPendente(user.id) : null;
  const preSelecionada = (await cookies()).get(COOKIE_DATA_PREFERIDA)?.value ?? null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/img/logo.png" alt="Vecchio School" width={80} height={80} className="h-16 w-auto" />
        </div>

        <h1 className="font-display text-paper mt-8 text-center text-3xl">Crie sua senha</h1>
        <p className="text-smoke mt-2 text-center text-sm">
          {pendente
            ? "Confirme a data da sua turma e defina a senha de acesso à sua conta Vecchio School."
            : "Defina a senha de acesso à sua conta Vecchio School."}
        </p>

        {error && (
          <p className="border-rosso text-rosso mt-6 rounded-sm border px-4 py-3 text-sm">{error}</p>
        )}

        <form action={setPassword} className="mt-8 space-y-4">
          {pendente && (
            <>
              <input type="hidden" name="matricula_id" value={pendente.matriculaId} />
              <EscolhaDataTurma datas={pendente.datas} preSelecionada={preSelecionada} />
            </>
          )}
          <div>
            <label htmlFor="password" className="text-smoke text-sm">
              Nova senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-4 py-2.5 outline-none focus:border-rosso"
            />
          </div>
          <div>
            <label htmlFor="confirmar" className="text-smoke text-sm">
              Confirmar senha
            </label>
            <input
              id="confirmar"
              name="confirmar"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-4 py-2.5 outline-none focus:border-rosso"
            />
          </div>

          <button
            type="submit"
            className="font-display bg-rosso text-paper mt-2 w-full rounded-sm px-6 py-3 text-lg tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
          >
            Salvar e entrar
          </button>
        </form>
      </div>
    </main>
  );
}
