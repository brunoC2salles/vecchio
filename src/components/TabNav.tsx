"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string };

type TabNavProps = {
  tabs: Tab[];
  className?: string;
};

// Abas de seção. No celular viram pílulas que quebram linha (sem rolagem lateral);
// no desktop mantêm o visual de links simples com sublinhado na aba ativa.
export function TabNav({ tabs, className = "" }: TabNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`flex flex-wrap gap-2 md:border-line md:gap-6 md:border-b md:pb-3 ${className}`}>
      {tabs.map((t) => {
        const ativo = pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={ativo ? "page" : undefined}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors md:rounded-none md:border-0 md:p-0 ${
              ativo
                ? "border-paper bg-paper text-ink md:text-paper md:bg-transparent md:underline md:decoration-oro md:underline-offset-8"
                : "border-line text-smoke hover:text-paper"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
