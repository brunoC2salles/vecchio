import Image from "next/image";
import Link from "next/link";
import { confirmarLink } from "./actions";

export default async function ConfirmarPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}) {
  const { token_hash: tokenHash, type } = await searchParams;
  const valido = Boolean(tokenHash) && (type === "invite" || type === "recovery");
  const recuperacao = type === "recovery";

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/img/logo.png" alt="Vecchio School" width={80} height={80} className="h-16 w-auto" />
        </div>

        {valido ? (
          <>
            <h1 className="font-display text-paper mt-8 text-center text-3xl">
              {recuperacao ? "Nova senha" : "Bem-vindo à Vecchio School"}
            </h1>
            <p className="text-smoke mt-2 text-center text-sm">
              {recuperacao
                ? "Toque no botão abaixo para definir uma nova senha de acesso."
                : "Toque no botão abaixo para criar sua senha e acessar a comunidade."}
            </p>

            <form action={confirmarLink} className="mt-8">
              <input type="hidden" name="token_hash" value={tokenHash} />
              <input type="hidden" name="type" value={type} />
              <button
                type="submit"
                className="font-display bg-rosso text-paper w-full rounded-sm px-6 py-3 text-lg tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
              >
                {recuperacao ? "Definir nova senha" : "Criar minha senha"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-paper mt-8 text-center text-3xl">Link inválido</h1>
            <p className="text-smoke mt-2 text-center text-sm">
              Este link está incompleto. Solicite um novo para criar sua senha.
            </p>
            <Link
              href="/esqueci-senha"
              className="font-display bg-rosso text-paper mt-8 block w-full rounded-sm px-6 py-3 text-center text-lg tracking-wide"
            >
              Receber novo link
            </Link>
          </>
        )}

        <p className="text-smoke mt-8 text-center text-sm">
          <Link href="/login" className="text-oro underline underline-offset-2">
            Ir para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
