"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/CTAButton";
import { FlameDoodle } from "@/components/Doodle";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <header className="relative overflow-hidden px-6 pb-16 pt-10 md:px-12 md:pb-24 md:pt-14">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Image src="/img/logo.png" alt="Vecchio School" width={96} height={96} className="h-14 w-auto md:h-16" />
        <CTAButton href="#investimento" variant="outline" className="px-5 py-2 text-sm md:text-base">
          Quero minha vaga
        </CTAButton>
      </nav>

      <div className="relative mx-auto mt-16 grid max-w-6xl gap-10 md:mt-24 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-smoke text-lg"
          >
            L&apos;arte della pizza napoletana
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display mt-3 text-[2.6rem] leading-[1.05] text-paper md:text-7xl"
          >
            Bene jovens, bora aprender o segredo da vera pizza napoletana com o Vecchio?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease }}
            className="text-smoke mt-6 max-w-md text-lg leading-relaxed"
          >
            Dois dias de imersão teórica e prática no método italiano da Verace Pizza
            Napoletana, conduzidos por um chef pizzaiolo certificado AVPN.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease }}
            className="mt-9"
          >
            <CTAButton href="#investimento">Quero minha vaga</CTAButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="text-rosso mx-auto"
        >
          <FlameDoodle className="h-56 w-40 md:h-72 md:w-52" />
        </motion.div>
      </div>
    </header>
  );
}
