import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CTAButton } from "@/components/CTAButton";

export default async function MatriculaPage() {
  const supabase = await createClient();

  const { data: turma } = await supabase
    .from("turmas")
    .select("id, nome, asaas_payment_link_id_pix, asaas_payment_link_id_cartao")
    .eq("status", "ativa")
    .order("data_evento", { ascending: true })
    .limit(1)
    .maybeSingle();

  const linkPix = turma?.asaas_payment_link_id_pix
    ? `https://www.asaas.com/c/${turma.asaas_payment_link_id_pix}`
    : null;
  const linkCartao = turma?.asaas_payment_link_id_cartao
    ? `https://www.asaas.com/c/${turma.asaas_payment_link_id_cartao}`
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center">
          <Image src="/img/logo.png" alt="Vecchio School" width={80} height={80} className="h-16 w-auto" />
        </div>

        <h1 className="font-display text-paper mt-8 text-center text-3xl md:text-4xl">Garanta sua vaga</h1>

        {!turma ? (
          <p className="text-smoke mt-4 text-center text-sm">
            Nenhuma turma com inscrições abertas no momento. Volte em breve.
          </p>
        ) : (
          <>
            <p className="text-smoke mt-2 text-center text-sm">
              Inscrição para {turma.nome}. Escolha a forma de pagamento pra ir direto pro checkout seguro do Asaas.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="border-line bg-char rounded-sm border p-6 text-center">
                <p className="text-smoke text-sm">À vista</p>
                <p className="font-display text-oro mt-1 text-4xl">R$847</p>
                <p className="text-smoke mt-1 text-sm">no Pix</p>
                {linkPix ? (
                  <CTAButton href={linkPix} className="mt-6 w-full">
                    Pagar com Pix
                  </CTAButton>
                ) : (
                  <p className="text-smoke mt-6 text-xs">Link de pagamento não configurado.</p>
                )}
              </div>

              <div className="border-line bg-char rounded-sm border p-6 text-center">
                <p className="text-smoke text-sm">Parcelado</p>
                <p className="font-display text-oro mt-1 text-4xl">R$987</p>
                <p className="text-smoke mt-1 text-sm">em até 3x sem juros no cartão</p>
                {linkCartao ? (
                  <CTAButton href={linkCartao} className="mt-6 w-full">
                    Pagar com Cartão
                  </CTAButton>
                ) : (
                  <p className="text-smoke mt-6 text-xs">Link de pagamento não configurado.</p>
                )}
              </div>
            </div>

            <p className="text-smoke mt-8 text-center text-xs">
              Depois de pagar, você recebe por e-mail o código de acesso ao curso presencial e o link pra criar
              sua senha de acesso à comunidade.
            </p>
          </>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-oro text-sm underline underline-offset-2">
            Voltar para o site
          </Link>
        </div>
      </div>
    </main>
  );
}
