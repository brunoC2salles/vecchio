"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { CTAButton } from "@/components/CTAButton";
import { MobileMenu } from "@/components/MobileMenu";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const heroImgRef = useRef<HTMLDivElement>(null);
  // Progresso de 0 a 1 enquanto a imagem do mobile sai de vista pelo topo da tela
  const { scrollYProgress } = useScroll({
    target: heroImgRef,
    offset: ["start start", "end start"],
  });
  const imgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <header className="relative overflow-hidden px-6 pb-16 pt-10 md:px-12 md:pb-24 md:pt-28">
      <nav className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-6xl items-center justify-between bg-transparent px-6 py-6 md:px-12 md:py-8">
        <Image src="/img/logo.png" alt="Vecchio School" width={96} height={96} className="h-14 w-auto md:h-16" />

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="font-display border-paper text-paper rounded-sm border-2 px-6 py-2.5 text-base tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
          >
            Comunidade
          </Link>
          <CTAButton href="#investimento" className="px-6 py-2.5 text-base">
            Quero minha vaga
          </CTAButton>
        </div>

        <MobileMenu />
      </nav>

      <div className="relative mx-auto grid max-w-6xl gap-1 md:grid-cols-[1fr_1.2fr] md:items-stretch md:gap-6">
        {/* No mobile essa imagem vem primeiro no fluxo e some com parallax ao rolar.
            No desktop ela nem entra no layout (display:none via md:hidden), quem
            aparece é a versão de baixo. Bleed horizontal (-mx-6) + proporção mais
            alta (3/4) para a caixa, com overflow-hidden + scale no <Image> para
            o personagem (o desenho em si) ficar maior dentro dessa caixa. */}
        <motion.div
          ref={heroImgRef}
          style={{ opacity: imgOpacity, y: imgY }}
          className="relative -mx-6 aspect-[3/4] w-[calc(100%+3rem)] overflow-hidden md:hidden"
        >
          <Image
            src="/img/galeria/hero-logo.png"
            alt="Vecchio School"
            fill
            priority
            className="scale-[1.3] object-contain"
          />
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-center text-3xl leading-[1.05] text-paper md:text-left md:text-7xl"
          >
            A escola Vecchio de fazer la Vera&nbsp;Pizza
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="text-smoke mx-auto mt-6 max-w-md text-center text-lg leading-relaxed md:mx-0 md:text-left md:text-xl"
          >
            Aprenda o método verace da pizza napoletana com quem vive isso todos os
            dias — da massa ao forno a lenha, ao lado de quem faz acontecer todos os
            dias la magia della&nbsp;pizza.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-9 flex justify-center md:justify-start"
          >
            <CTAButton href="#investimento">Quero minha vaga</CTAButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="relative hidden h-full items-center justify-end md:flex"
        >
          <Image
            src="/img/galeria/hero-logo.png"
            alt="Vecchio School"
            width={800}
            height={600}
            priority
            className="h-full w-auto scale-[1.3] object-contain"
          />
        </motion.div>
      </div>
    </header>
  );
}
