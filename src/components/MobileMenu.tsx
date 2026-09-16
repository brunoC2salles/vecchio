"use client";

import { useState } from "react";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";

const secoes = [
  { href: "#curso", label: "O curso" },
  { href: "#quem-somos", label: "Quem somos" },
  { href: "#metodologia", label: "O que vai aprender" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#parceiros", label: "Parceiros" },
  { href: "#investimento", label: "Investimento" },
  { href: "#faq", label: "Perguntas frequentes" },
];

export function MobileMenu() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        className="text-paper flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span className="bg-paper h-0.5 w-6" />
        <span className="bg-paper h-0.5 w-6" />
        <span className="bg-paper h-0.5 w-6" />
      </button>

      {aberto && (
        <div className="bg-ink fixed inset-0 z-50 flex flex-col px-6 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-paper text-lg">Menu</span>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
              className="text-paper text-3xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="mt-6">
            <CTAButton href="#investimento" onClick={() => setAberto(false)} className="w-full">
              Quero minha vaga
            </CTAButton>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto">
            {secoes.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setAberto(false)}
                className="border-line text-paper border-b py-4 text-lg"
              >
                {s.label}
              </a>
            ))}
          </nav>

          <Link
            href="/login"
            onClick={() => setAberto(false)}
            className="font-display border-paper text-paper mt-6 w-full rounded-sm border-2 px-7 py-3 text-center text-lg tracking-wide"
          >
            Comunidade
          </Link>
        </div>
      )}
    </>
  );
}
