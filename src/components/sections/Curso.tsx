import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

const fotos = [
  "/img/galeria/vecchio-2.jpg",
  "/img/galeria/aula-2.jpg",
  "/img/galeria/forno.jpg",
  "/img/galeria/vecchio-3.jpg",
];

const detalhes = [
  { label: "Quando", valor: "24 e 25 de outubro, das 10h às 14h" },
  { label: "Onde", valor: "Pizzaria Vecchio Napoletana — Rua Silva Jardim 1043, Santa Maria/RS" },
  { label: "Conduzido por", valor: "Chef pizzaiolo Lucas Molz Lara, certificado AVPN" },
];

export function Curso() {
  return (
    <section id="curso" className="px-6 py-4 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl text-paper md:text-6xl">
          L&apos;arte della pizza&nbsp;napoletana
        </h2>
        <p className="text-smoke mt-6 text-lg leading-relaxed">
          Curso presencial em Santa Maria/RS. Dois dias de muita prática — do preparo
          da massa à abertura e cocção em forno a lenha — abordando toda a parte
          histórica e técnica da verdadeira pizza napoletana: farinha, fermentação,
          maturação e forno.
        </p>

        <dl className="mt-10 grid gap-6 md:grid-cols-3">
          {detalhes.map((d) => (
            <div key={d.label}>
              <dt className="text-rosso font-display text-sm">{d.label}</dt>
              <dd className="text-paper mt-2 text-lg leading-snug">{d.valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {fotos.map((src) => (
            <div key={src} className="border-line relative aspect-square overflow-hidden rounded-sm border">
              <Image src={src} alt="Vecchio Napoletana" fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CTAButton href="/matricula" className="px-8 py-3.5 text-xl">
            Garantir minha vaga
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
