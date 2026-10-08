import { CTAButton } from "@/components/CTAButton";
import { KitUniformeBadge } from "@/components/KitUniformeBadge";

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
        <div className="flex flex-col-reverse items-end gap-3 md:flex-row md:items-start md:justify-between">
          <h2 className="font-display self-start text-4xl text-paper md:text-5xl">Investimento</h2>
          {/* Margem à direita para não encostar no quadriculado do canto */}
          <span className="bg-rosso text-paper font-body mr-8 shrink-0 rounded-sm px-3 py-1.5 text-sm font-bold tracking-wide md:mr-4 md:mt-3">
            10 vagas por turma
          </span>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-baseline gap-3">
            {/* A fonte Bogart (trial) não tem os dígitos — usando fonte bold normal até a licença ser comprada */}
            <span className="text-oro font-body text-5xl font-bold md:text-6xl">R$847</span>
            <span className="text-smoke text-lg">à vista no Pix</span>
          </div>
          <p className="text-smoke mt-2 text-base">
            ou no cartão por R$987, em até 3x de R$329 sem juros
          </p>
        </div>

        <div className="border-line mt-8 border-t pt-6">
          <p className="text-rosso font-display text-sm">Turmas</p>
          <p className="text-paper mt-2 text-lg leading-snug">
            24 e 25 de outubro ou 7 e 8 de novembro, das 10h às 14h. Você escolhe a data na inscrição.
          </p>
        </div>

        <ul className="mt-10 space-y-4">
          {inclusos.map((item) => (
            <li key={item} className="text-paper flex items-start gap-3 text-lg leading-snug">
              <span className="bg-rosso mt-2.5 h-2 w-2 flex-shrink-0 rounded-full" />
              <span className="flex flex-wrap items-center">
                {item}
                {item.startsWith("Kit de uniforme") && <KitUniformeBadge />}
              </span>
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
