"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SeamDividerProps = {
  icon: ReactNode;
  label?: string;
};

/**
 * Costura visual entre seções: uma faixa desenha da esquerda
 * para a direita conforme entra na viewport, e o doodle gira/aparece no centro —
 * o fio condutor único que liga as 9 seções, inspirado nas transições do
 * fradesign.it, mas com vocabulário de pizzaria. O xadrez fica reservado para
 * detalhes dentro das seções, não para essa costura.
 */
export function SeamDivider({ icon, label }: SeamDividerProps) {
  return (
    <div className="relative flex items-center justify-center py-10 md:py-14" aria-hidden={label ? undefined : true}>
      <motion.div
        className="bg-line h-px w-full max-w-5xl origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-ink text-oro md:h-20 md:w-20"
        initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {icon}
      </motion.div>
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
