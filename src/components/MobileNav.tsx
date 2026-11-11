"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconAdmin, IconCMV, IconComunidade, IconPerfil, IconReceitas } from "@/components/Sidebar";

type MobileNavProps = {
  isAdmin: boolean;
};

// Navegação do painel no celular: barra fixa no rodapé, no lugar da barra lateral.
export function MobileNav({ isAdmin }: MobileNavProps) {
  const pathname = usePathname();

  const itens = [
    { href: "/dashboard/cmv", base: "/dashboard/cmv", label: "CMV", Icon: IconCMV },
    { href: "/dashboard/comunidade/feed", base: "/dashboard/comunidade", label: "Comunidade", Icon: IconComunidade },
    { href: "/dashboard/receitas", base: "/dashboard/receitas", label: "Receitas", Icon: IconReceitas },
    { href: "/dashboard/perfil", base: "/dashboard/perfil", label: "Perfil", Icon: IconPerfil },
    ...(isAdmin ? [{ href: "/dashboard/admin", base: "/dashboard/admin", label: "Admin", Icon: IconAdmin }] : []),
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="border-line bg-ink/95 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="flex">
        {itens.map(({ href, base, label, Icon }) => {
          const ativo = pathname === base || pathname.startsWith(`${base}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={`flex flex-col items-center gap-1 px-1 pt-2.5 pb-2 text-[11px] tracking-wide transition-colors ${
                  ativo ? "text-oro" : "text-smoke"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
