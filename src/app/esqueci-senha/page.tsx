import Image from "next/image";
import Link from "next/link";
import { solicitarRecuperacao } from "./actions";

export default async function EsqueciSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/img/logo.png" alt="Vecchio School" width={80} height={80} className="h-16 w-auto" />
        </div>

        <h1 className="font-display text-paper mt-8 text-center text-3xl">Esqueceu a senha?</h1>
        <p className="text-smoke mt-2 text-center text-sm">
          Digite seu e-mail e enviamos um link para você criar uma nova senha.
        </p>

        {error && <p className="border-rosso text-rosso mt-6 rounded-sm border px-4 py-3 text-sm">{error}</p>}
        {ok && (
          <p className="border-line text-paper mt-6 rounded-sm border px-4 py-3 text-sm">
            Se esse e-mail estiver cadastrado, você vai receber o link em instantes.
          </p>
        )}

        <form action={solicitarRecuperacao} className="mt-8 space-y-4">
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

          <button
            type="submit"
            className="font-display bg-rosso text-paper mt-2 w-full rounded-sm px-6 py-3 text-lg tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
          >
            Enviar link
          </button>
        </form>

        <p className="text-smoke mt-8 text-center text-sm">
          <Link href="/login" className="text-oro underline underline-offset-2">
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
