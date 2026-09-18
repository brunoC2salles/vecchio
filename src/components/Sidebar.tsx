"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/dashboard/actions";

type SidebarProps = {
  nome: string;
  role: string;
  isPatrocinador: boolean;
  isAdmin: boolean;
};

function IconCMV(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 7.5h9M7.5 11h2M11.5 11h2M15.5 11h2M7.5 14.5h2M11.5 14.5h2M15.5 14.5h2M7.5 18h2M11.5 18h2M15.5 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconComunidade(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 13.2c2.4.3 4 2 4 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconReceitas(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 3v18M6 3c3 0 3 3 3 5s0 5-3 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 3v7a3 3 0 0 1-3 3M17 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconPerfil(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconAdmin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSair(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 4H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 20h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 8l4 4-4 4M17 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconRetrair(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M15 5l-6 7 6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconEspacos(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IconAulas(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 8.5l6 3.5-6 3.5v-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconMaterial(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6.5 3.5h8l4 4v13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3.5v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 13h7M8.5 16.5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconEventos(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconPatrocinadores(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 5.5c-1.5-2-5-2-6.5.5-1.5 2.5 0 5 1 6L12 17l5.5-5c1-1 2.5-3.5 1-6-1.5-2.5-5-2.5-6.5-.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const links = [{ href: "/dashboard/cmv", label: "Calculadora de CMV", Icon: IconCMV }];

const comunidadeLink = { href: "/dashboard/comunidade/feed", label: "Comunidade", Icon: IconComunidade };

const outrosLinks = [{ href: "/dashboard/receitas", label: "Receitas", Icon: IconReceitas }];

export function Sidebar({ nome, role, isPatrocinador, isAdmin }: SidebarProps) {
  const [aberto, setAberto] = useState(false);
  const podeVerSalaDeAula = !isPatrocinador || isAdmin;

  const comunidadeSubLinks = [
    { href: "/dashboard/comunidade/espacos", label: "Espaços", Icon: IconEspacos },
    ...(podeVerSalaDeAula ? [{ href: "/dashboard/comunidade/aulas", label: "Sala de aula", Icon: IconAulas }] : []),
    ...(podeVerSalaDeAula
      ? [{ href: "/dashboard/comunidade/material-extra", label: "Material extra", Icon: IconMaterial }]
      : []),
    { href: "/dashboard/comunidade/eventos", label: "Eventos", Icon: IconEventos },
    { href: "/dashboard/comunidade/patrocinadores", label: "Patrocinadores", Icon: IconPatrocinadores },
  ];

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-shrink-0 flex-col bg-transparent px-4 py-8 transition-all duration-200 ${
        aberto ? "w-64" : "w-20"
      }`}
    >
      <div className={`flex items-center ${aberto ? "justify-between px-2" : "justify-center"}`}>
        <Link href="/dashboard/comunidade/feed" className={aberto ? "block" : "hidden"}>
          <Image src="/img/logo.png" alt="Vecchio School" width={64} height={64} className="h-10 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-label={aberto ? "Recolher menu" : "Expandir menu"}
          className="text-smoke hover:text-paper flex h-8 w-8 items-center justify-center"
        >
          <IconRetrair className={`h-4 w-4 transition-transform ${aberto ? "" : "rotate-180"}`} />
        </button>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto">
        {links.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            title={aberto ? undefined : label}
            className={`text-paper hover:bg-char flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
              aberto ? "" : "justify-center"
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {aberto && <span>{label}</span>}
          </Link>
        ))}

        <Link
          href={comunidadeLink.href}
          title={aberto ? undefined : comunidadeLink.label}
          className={`text-paper hover:bg-char flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
            aberto ? "" : "justify-center"
          }`}
        >
          <comunidadeLink.Icon className="h-5 w-5 flex-shrink-0" />
          {aberto && <span>{comunidadeLink.label}</span>}
        </Link>

        {aberto && (
          <div className="ml-4 flex flex-col gap-1 border-l border-line pl-3">
            {comunidadeSubLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="text-smoke hover:text-paper flex items-center gap-2.5 rounded-sm px-2 py-2 text-sm transition-colors"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}

        {outrosLinks.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            title={aberto ? undefined : label}
            className={`text-paper hover:bg-char flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
              aberto ? "" : "justify-center"
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {aberto && <span>{label}</span>}
          </Link>
        ))}

        <Link
          href="/dashboard/perfil"
          title={aberto ? undefined : "Meu perfil"}
          className={`text-paper hover:bg-char flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
            aberto ? "" : "justify-center"
          }`}
        >
          <IconPerfil className="h-5 w-5 flex-shrink-0" />
          {aberto && <span>Meu perfil</span>}
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/admin"
            title={aberto ? undefined : "Administração"}
            className={`text-paper hover:bg-char flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
              aberto ? "" : "justify-center"
            }`}
          >
            <IconAdmin className="h-5 w-5 flex-shrink-0" />
            {aberto && <span>Administração</span>}
          </Link>
        )}
      </nav>

      <div className={`border-line border-t pt-4 ${aberto ? "" : "flex flex-col items-center"}`}>
        {aberto && (
          <>
            <p className="text-paper text-sm">{nome}</p>
            <p className="text-smoke text-xs capitalize">
              {role}
              {isPatrocinador ? " · patrocinador" : ""}
            </p>
          </>
        )}
        <form action={signOut} className={aberto ? "mt-3" : "mt-2"}>
          <button
            type="submit"
            title={aberto ? undefined : "Sair"}
            className="text-smoke hover:text-paper flex items-center gap-2 text-xs"
          >
            <IconSair className="h-4 w-4" />
            {aberto && <span className="underline underline-offset-2">Sair</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
