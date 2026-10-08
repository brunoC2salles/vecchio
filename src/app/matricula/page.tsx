import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { COOKIE_DATA_PREFERIDA, listarDatasTurma } from "@/lib/turma-datas";
import { MatriculaCheckout } from "./MatriculaCheckout";

export default async function MatriculaPage() {
  const supabase = await createClient();

  const { data: turma } = await supabase
    .from("turmas")
    .select("id, nome, asaas_payment_link_id_pix, asaas_payment_link_id_cartao")
    .eq("status", "ativa")
    .order("data_evento", { ascending: true })
    .limit(1)
    .maybeSingle();

  const datas = turma ? await listarDatasTurma(turma.id) : [];
  const preSelecionada = (await cookies()).get(COOKIE_DATA_PREFERIDA)?.value ?? null;

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
              {datas.length > 1
                ? `Inscrição para ${turma.nome}. Escolha a data da sua turma e a forma de pagamento para ir direto ao checkout seguro do Asaas.`
                : `Inscrição para ${turma.nome}. Escolha a forma de pagamento pra ir direto pro checkout seguro do Asaas.`}
            </p>

            <MatriculaCheckout
              datas={datas}
              linkPix={linkPix}
              linkCartao={linkCartao}
              preSelecionada={preSelecionada}
            />
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
