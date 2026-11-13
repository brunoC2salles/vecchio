import { CTAButton } from "@/components/CTAButton";
import { VimeoEmbed } from "@/components/VimeoEmbed";

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

// Divide em duas colunas independentes (3 itens cada) em vez de pares lado a lado —
// assim a altura de um item não depende do item ao lado, evitando desalinhamento.
const colunaEsquerda = modulos.slice(0, 3);
const colunaDireita = modulos.slice(3);

// Vídeos verticais (1280 x 2276). A proporção do container é a mesma do vídeo,
// então o player não mostra bordas pretas.
const videos = [
  { id: "1246611521", titulo: "Vídeo 1 do curso Vecchio School" },
  { id: "1246613406", titulo: "Vídeo 2 do curso Vecchio School" },
];
const PROPORCAO_VERTICAL = `${(2276 / 1280) * 100}%`;

function Modulo({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="bg-rosso mt-3 h-3 w-3 flex-shrink-0 rounded-full" />
      <div>
        <h3 className="font-display text-paper text-xl md:text-2xl">{titulo}</h3>
        <p className="text-smoke mt-2 max-w-md text-base leading-relaxed">{texto}</p>
      </div>
    </div>
  );
}

export function Metodologia() {
  return (
    <section id="metodologia" className="px-6 py-4 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl text-paper md:text-6xl">O que você vai&nbsp;aprender</h2>

        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          <div className="space-y-8">
            {colunaEsquerda.map((m) => (
              <Modulo key={m.titulo} {...m} />
            ))}
          </div>
          <div className="space-y-8">
            {colunaDireita.map((m) => (
              <Modulo key={m.titulo} {...m} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-sm gap-6 md:max-w-3xl md:grid-cols-2 md:gap-8">
          {videos.map((v) => (
            <VimeoEmbed
              key={v.id}
              videoId={v.id}
              title={v.titulo}
              aspectRatio={PROPORCAO_VERTICAL}
              className="border-line overflow-hidden rounded-sm border"
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CTAButton href="#investimento">Quero aprender com o Vecchio</CTAButton>
        </div>
      </div>
    </section>
  );
}
