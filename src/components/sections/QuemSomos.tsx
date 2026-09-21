import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

export function QuemSomos() {
  return (
    <section id="quem-somos" className="px-6 py-4 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="relative">
          <div className="checker absolute -bottom-4 -left-4 h-20 w-20 rotate-6 rounded-sm" />
          <div className="border-line bg-char relative aspect-[4/5] overflow-hidden rounded-sm border">
            <Image
              src="/img/galeria/quem-somos.jpg"
              alt="Chef pizzaiolo da Vecchio Napoletana preparando uma pizza"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl text-paper md:text-6xl">Quem somos</h2>
          <p className="text-smoke mt-6 max-w-2xl text-lg leading-relaxed">
            A Vecchio Napoletana é uma pizzaria Verace Napoletana certificada pela
            AVPN (registro #929) — uma de apenas 30 no Brasil e 6 no Rio Grande do
            Sul. Há mais de 5 anos no mercado de Santa Maria, tem como principal
            característica a inovação na criação dos pratos, sempre mantendo a
            tradição rigorosa dos processos napoletanos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <CTAButton href="#metodologia" variant="outline">
              Conheça o curso
            </CTAButton>
            <CTAButton href="https://www.instagram.com/vecchionapoletana/" target="_blank" rel="noopener noreferrer">
              Conheça a Vecchio
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
