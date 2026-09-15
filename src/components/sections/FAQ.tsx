"use client";

import { useState } from "react";
import { CTAButton } from "@/components/CTAButton";

const perguntas = [
  {
    q: "O que está incluso no curso?",
    a: "Aula com o chef pizzaiolo verace, certificado de participação, kit de uniforme (camiseta e avental), apostila didática, kit pizza com farinha Le5Stagioni e tomate pelati Ciao Italia, acesso à comunidade Vecchio School e condição especial na compra do forno Pompei.",
  },
  {
    q: "Quais os dias e horários?",
    a: "24 e 25 de outubro, das 10h às 14h.",
  },
  {
    q: "Onde é realizado o curso?",
    a: "Na Pizzaria Vecchio Napoletana, Rua Silva Jardim 1043, Santa Maria/RS.",
  },
  {
    q: "Quem ministra o curso?",
    a: "O chef pizzaiolo Lucas Molz Lara, engenheiro agrônomo, certificado como pizzaiolo verace pela AVPN, há mais de 5 anos à frente do forno da Vecchio Napoletana.",
  },
  {
    q: "Recebo certificado?",
    a: "Sim, certificado de conclusão de 8h, assinado pelo chef pizzaiolo verace.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "À vista por $800 ou parcelado em até 3x de $299.",
  },
  {
    q: "O aprendizado acaba no fim do curso?",
    a: "Não. O curso dá acesso à plataforma Vecchio School, um espaço para troca de conhecimento, dúvidas e resultados com professores, alunos e patrocinadores.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-4 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-4xl text-paper md:text-6xl">Perguntas frequentes</h2>

        <div className="border-line mt-10 border-t">
          {perguntas.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-line border-b">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-paper text-lg md:text-xl">{item.q}</span>
                  <span className="text-rosso font-display text-2xl leading-none">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && (
                  <p className="text-smoke max-w-xl pb-6 text-base leading-relaxed">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <CTAButton href="#contato" variant="outline">
            Ainda com dúvidas? Fale com a gente
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
