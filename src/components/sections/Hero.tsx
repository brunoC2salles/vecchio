"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/CTAButton";
import { MobileMenu } from "@/components/MobileMenu";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <header className="relative overflow-hidden px-6 pb-16 pt-8 md:px-12 md:pb-24 md:pt-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
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

      <div className="relative mx-auto mt-14 grid max-w-6xl gap-10 md:mt-20 md:grid-cols-[1.1fr_0.9fr] md:items-center">
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
            className="font-display mt-3 text-4xl leading-[1.05] text-paper md:text-6xl"
          >
            A vera pizza napoletana, do jeito certo.
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div
            className="absolute inset-0"
            style={{
              maskImage: "radial-gradient(ellipse 62% 62% at center, black 50%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 62% 62% at center, black 50%, transparent 100%)",
            }}
          >
            <Image
              src="/img/galeria/hero-pizza.jpg"
              alt="Pizza Margherita da Vecchio Napoletana"
              fill
              priority
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
