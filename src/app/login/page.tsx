import Image from "next/image";
import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next = "/dashboard" } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/img/logo.png" alt="Vecchio School" width={80} height={80} className="h-16 w-auto" />
        </div>

        <h1 className="font-display text-paper mt-8 text-center text-3xl">Entrar</h1>
        <p className="text-smoke mt-2 text-center text-sm">
          Acesse com o e-mail e a senha da sua conta Vecchio School.
        </p>

        {error && (
          <p className="border-rosso text-rosso mt-6 rounded-sm border px-4 py-3 text-sm">{error}</p>
        )}

        <form action={login} className="mt-8 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="text-smoke text-sm">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-4 py-2.5 outline-none focus:border-rosso"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-smoke text-sm">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-4 py-2.5 outline-none focus:border-rosso"
            />
          </div>

          <button
            type="submit"
            className="font-display bg-rosso text-paper mt-2 w-full rounded-sm px-6 py-3 text-lg tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
          >
            Entrar
          </button>
        </form>

        <p className="text-smoke mt-8 text-center text-sm">
          Ainda não é aluno?{" "}
          <Link href="/#investimento" className="text-oro underline underline-offset-2">
            Conheça o curso
          </Link>
        </p>
      </div>
    </main>
  );
}
