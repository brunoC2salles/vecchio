import Image from "next/image";
import Link from "next/link";
import { matricular } from "./actions";

export default async function MatriculaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/img/logo.png" alt="Vecchio School" width={80} height={80} className="h-16 w-auto" />
        </div>

        {ok ? (
          <div className="mt-8 text-center">
            <h1 className="font-display text-paper text-3xl">Vaga garantida!</h1>
            <p className="text-smoke mt-3 text-sm leading-relaxed">
              Manda um e-mail com o código de acesso ao curso e o link pra você criar sua senha.
              Confira a caixa de entrada (e o spam, por garantia).
            </p>
            <Link href="/" className="text-oro mt-6 inline-block text-sm underline underline-offset-2">
              Voltar para o site
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-paper mt-8 text-center text-3xl">Garantir minha vaga</h1>
            <p className="text-smoke mt-2 text-center text-sm">
              Preencha seus dados. Em instantes você recebe o código de acesso ao curso e o link
              pra criar sua conta na comunidade.
            </p>

            {error && <p className="border-rosso text-rosso mt-6 rounded-sm border px-4 py-3 text-sm">{error}</p>}

            <form action={matricular} className="mt-8 space-y-4">
              <div>
                <label htmlFor="nome" className="text-smoke text-sm">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  required
                  className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-4 py-2.5 outline-none focus:border-rosso"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-smoke text-sm">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-4 py-2.5 outline-none focus:border-rosso"
                />
              </div>
              <div>
                <label htmlFor="telefone" className="text-smoke text-sm">
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  placeholder="(55) 99999-9999"
                  className="border-line bg-char text-paper mt-1 w-full rounded-sm border px-4 py-2.5 outline-none focus:border-rosso"
                />
              </div>

              <button
                type="submit"
                className="font-display bg-rosso text-paper mt-2 w-full rounded-sm px-6 py-3 text-lg tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
              >
                Garantir minha vaga
              </button>

              <p className="text-smoke text-center text-xs">
                Pagamento por fora ainda, combinado direto com a Vecchio — o processador de cartão entra em breve.
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
