import { CTAButton } from "@/components/CTAButton";

const modulos = [
  {
    titulo: "Técnicas por trás da Verace Pizza Napoletana",
    texto:
      "Uma breve introdução à história da verace pizza napoletana, escolha das farinhas, métodos de processo, força da farinha, impasto verace, fermentação e maturação.",
  },
  {
    titulo: "Impasto",
    texto: "Cada aluno fará seu próprio impasto, respeitando rigorosamente a tradição da AVPN.",
  },
  {
    titulo: "Boleamento",
    texto:
      "Processo essencial: diferentes maneiras de bolear a massa pré-fermentação e o uso correto das caixas de fermentação.",
  },
  {
    titulo: "Abertura da massa",
    texto: "Como executar o Schiaffo Napoletano, método clássico para abertura manual da massa.",
  },
  {
    titulo: "Montagem e execução",
    texto:
      "Pizzas clássicas Margherita e Marinara, além da diferença entre mozzarella fiordilatte e búfala.",
  },
  {
    titulo: "Cocção e forneamento em forno a lenha",
    texto:
      "Toda a parte técnica para ter o controle e entender o correto forneamento das pizzas em forno a lenha napoletano, com temperatura acima de 450°C.",
  },
];

export function Metodologia() {
  return (
    <section id="metodologia" className="px-6 py-4 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl text-paper md:text-6xl">O que você vai aprender</h2>

        <div className="mt-10 grid gap-px md:grid-cols-2">
          {modulos.map((m, i) => (
            <div key={m.titulo} className="border-line border-t py-7 pr-6 md:border-r md:py-9">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-oro text-2xl">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-paper text-xl md:text-2xl">{m.titulo}</h3>
              </div>
              <p className="text-smoke mt-3 max-w-md text-base leading-relaxed">{m.texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <CTAButton href="#investimento">Quero aprender com o Vecchio</CTAButton>
        </div>
      </div>
    </section>
  );
}
