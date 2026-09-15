import { Hero } from "@/components/sections/Hero";
import { Curso } from "@/components/sections/Curso";
import { QuemSomos } from "@/components/sections/QuemSomos";
import { Metodologia } from "@/components/sections/Metodologia";
import { ProvaSocial } from "@/components/sections/ProvaSocial";
import { Parceiros } from "@/components/sections/Parceiros";
import { Investimento } from "@/components/sections/Investimento";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { SeamDivider } from "@/components/SeamDivider";
import { WheatDoodle, DoughDoodle, PeelDoodle, SliceDoodle, FlameDoodle } from "@/components/Doodle";

const iconClass = "h-9 w-9 md:h-11 md:w-11";

export default function Home() {
  return (
    <main>
      <Hero />
      <SeamDivider icon={<WheatDoodle className={iconClass} />} label="Sobre a Vecchio Napoletana" />
      <Curso />
      <SeamDivider icon={<DoughDoodle className={iconClass} />} label="Quem somos" />
      <QuemSomos />
      <SeamDivider icon={<PeelDoodle className={iconClass} />} label="O que você vai aprender" />
      <Metodologia />
      <SeamDivider icon={<SliceDoodle className={iconClass} />} label="Depoimentos" />
      <ProvaSocial />
      <SeamDivider icon={<WheatDoodle className={iconClass} />} label="Parceiros" />
      <Parceiros />
      <SeamDivider icon={<FlameDoodle className={iconClass} />} label="Investimento" />
      <Investimento />
      <SeamDivider icon={<DoughDoodle className={iconClass} />} label="Perguntas frequentes" />
      <FAQ />
      <SeamDivider icon={<PeelDoodle className={iconClass} />} label="Contato" />
      <Footer />
    </main>
  );
}
