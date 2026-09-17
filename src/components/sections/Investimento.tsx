import { CTAButton } from "@/components/CTAButton";

const inclusos = [
  "Aula com chef pizzaiolo verace",
  "Certificado de participação (8h, assinado pelo chef pizzaiolo verace)",
  "Kit de uniforme completo: camiseta (LAB) e avental (Sauce & Co.)",
  "Kit pizza com farinha Le5Stagioni e tomate pelati Ciao Italia",
  "Apostila didática completa com tudo abordado no curso",
  "Acesso à comunidade exclusiva Vecchio School",
  "Condição especial na compra do forno Pompei, dos parceiros FornoSanto",
];

export function Investimento() {
  return (
    <section id="investimento" className="px-6 py-4 md:px-12">
      <div className="border-line bg-char relative mx-auto max-w-4xl overflow-hidden rounded-sm border p-8 md:p-14">
        <div className="checker absolute -right-6 -top-6 h-20 w-20 rotate-12 rounded-sm opacity-90" />
        <h2 className="font-display text-4xl text-paper md:text-5xl">Investimento</h2>

        <div className="mt-6">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-oro text-5xl md:text-6xl">R$847</span>
            <span className="text-smoke text-lg">à vista no Pix</span>
          </div>
          <p className="text-smoke mt-2 text-base">
            ou no cartão por R$987, em até 3x de R$329 sem juros
          </p>
        </div>

        <ul className="mt-10 space-y-4">
          {inclusos.map((item) => (
            <li key={item} className="text-paper flex items-start gap-3 text-lg leading-snug">
              <span className="bg-rosso mt-2.5 h-2 w-2 flex-shrink-0 rounded-full" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <CTAButton href="/matricula">Garantir minha vaga</CTAButton>
        </div>
      </div>
    </section>
  );
}
