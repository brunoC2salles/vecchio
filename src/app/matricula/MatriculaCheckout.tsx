"use client";

import { useState } from "react";
import clsx from "clsx";
import { CTAButton } from "@/components/CTAButton";
import type { TurmaData } from "@/lib/turma-datas";

const COOKIE = "vecchio_data_preferida";

function salvarPreferencia(id: string) {
  // 30 dias: tempo de sobra entre o pagamento e a criação da senha
  document.cookie = `${COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function MatriculaCheckout({
  datas,
  linkPix,
  linkCartao,
  preSelecionada,
}: {
  datas: TurmaData[];
  linkPix: string | null;
  linkCartao: string | null;
  preSelecionada: string | null;
}) {
  const inicial = datas.find((d) => d.id === preSelecionada && !d.lotada)?.id ?? null;
  const [escolhida, setEscolhida] = useState<string | null>(inicial);

  const temDatas = datas.length > 0;
  const todasLotadas = temDatas && datas.every((d) => d.lotada);
  const liberado = !temDatas || escolhida !== null;
  const rotuloEscolhido = datas.find((d) => d.id === escolhida)?.rotulo;

  function escolher(id: string) {
    setEscolhida(id);
    salvarPreferencia(id);
  }

  if (todasLotadas) {
    return (
      <div className="border-line bg-char mt-10 rounded-sm border p-6 text-center">
        <p className="text-paper">As duas turmas estão lotadas.</p>
        <CTAButton
          href="https://wa.me/5555999211984?text=Bene%20Vecchios%2C%20quero%20entrar%20na%20lista%20de%20espera%20do%20curso!"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          className="mt-6"
        >
          Entrar na lista de espera
        </CTAButton>
      </div>
    );
  }

  return (
    <>
      {temDatas && (
        <div className="mt-10">
          <p className="font-display text-paper text-center text-xl">1. Escolha a data</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {datas.map((d) => {
              const ativa = escolhida === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={d.lotada}
                  onClick={() => escolher(d.id)}
                  aria-pressed={ativa}
                  className={clsx(
                    "bg-char rounded-sm border-2 p-5 text-center transition-colors duration-200",
                    ativa ? "border-oro!" : "border-line",
                    d.lotada ? "cursor-not-allowed opacity-50" : "hover:border-oro!"
                  )}
                >
                  <span className="font-body text-paper block text-2xl font-bold">{d.rotulo}</span>
                  <span className="text-smoke mt-1 block text-sm">das 10h às 14h</span>
                  <span className={clsx("mt-3 block text-xs", d.lotada ? "text-rosso" : "text-oro")}>
                    {d.lotada
                      ? "turma lotada"
                      : `${d.restantes} ${d.restantes === 1 ? "vaga restante" : "vagas restantes"}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {temDatas && (
        <p className="font-display text-paper mt-10 text-center text-xl">2. Escolha a forma de pagamento</p>
      )}

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="border-line bg-char rounded-sm border p-6 text-center">
          <p className="text-smoke text-sm">À vista</p>
          <p className="text-oro font-body mt-1 text-4xl font-bold">R$847</p>
          <p className="text-smoke mt-1 text-sm">no Pix</p>
          <BotaoPagamento href={linkPix} liberado={liberado}>
            Pagar com Pix
          </BotaoPagamento>
        </div>

        <div className="border-line bg-char rounded-sm border p-6 text-center">
          <p className="text-smoke text-sm">Parcelado</p>
          <p className="text-oro font-body mt-1 text-4xl font-bold">R$987</p>
          <p className="text-smoke mt-1 text-sm">em até 3x sem juros no cartão</p>
          <BotaoPagamento href={linkCartao} liberado={liberado}>
            Pagar com Cartão
          </BotaoPagamento>
        </div>
      </div>

      <p className="text-smoke mt-8 text-center text-xs">
        {rotuloEscolhido
          ? `Data escolhida: ${rotuloEscolhido}. Você confirma essa data ao criar sua senha de acesso, depois do pagamento.`
          : temDatas
            ? "Escolha a data acima para liberar o pagamento."
            : "Depois de pagar, você recebe por e-mail o código de acesso ao curso presencial e o link pra criar sua senha de acesso à comunidade."}
      </p>
    </>
  );
}

function BotaoPagamento({
  href,
  liberado,
  children,
}: {
  href: string | null;
  liberado: boolean;
  children: React.ReactNode;
}) {
  if (!href) {
    return <p className="text-smoke mt-6 text-xs">Link de pagamento não configurado.</p>;
  }

  if (!liberado) {
    return (
      <span
        aria-disabled="true"
        className="font-display bg-rosso text-paper mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-sm px-7 py-3 text-lg tracking-wide opacity-40"
      >
        {children}
      </span>
    );
  }

  return (
    <CTAButton href={href} className="mt-6 w-full">
      {children}
    </CTAButton>
  );
}
