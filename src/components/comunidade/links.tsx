import type { ReactNode } from "react";

const URL_REGEX = /\b(?:https?:\/\/|www\.)[^\s<>"]+/gi;
const PONTUACAO_FINAL = /[.,;:!?'"\]}>]+$/;

function limparFinal(bruto: string): string {
  let url = bruto.replace(PONTUACAO_FINAL, "");
  // Remove ")" final só se não houver "(" correspondente (ex: "(veja https://site.com)")
  while (url.endsWith(")") && (url.match(/\(/g)?.length ?? 0) < (url.match(/\)/g)?.length ?? 0)) {
    url = url.slice(0, -1).replace(PONTUACAO_FINAL, "");
  }
  return url;
}

function normalizar(url: string): string | null {
  const comProtocolo = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    const u = new URL(comProtocolo);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

type Trecho = { tipo: "texto"; valor: string } | { tipo: "link"; valor: string; href: string };

function dividir(texto: string): Trecho[] {
  const trechos: Trecho[] = [];
  let ultimo = 0;

  for (const match of texto.matchAll(URL_REGEX)) {
    const inicio = match.index ?? 0;
    const bruto = limparFinal(match[0]);
    const href = bruto ? normalizar(bruto) : null;
    if (!href) continue;

    if (inicio > ultimo) trechos.push({ tipo: "texto", valor: texto.slice(ultimo, inicio) });
    trechos.push({ tipo: "link", valor: bruto, href });
    ultimo = inicio + bruto.length;
  }

  if (ultimo < texto.length) trechos.push({ tipo: "texto", valor: texto.slice(ultimo) });
  return trechos;
}

export function primeiroLink(texto: string): string | null {
  const link = dividir(texto).find((t) => t.tipo === "link");
  return link && link.tipo === "link" ? link.href : null;
}

export function TextoComLinks({ texto }: { texto: string }): ReactNode {
  return dividir(texto).map((t, i) =>
    t.tipo === "texto" ? (
      t.valor
    ) : (
      <a
        key={i}
        href={t.href}
        target="_blank"
        rel="noopener noreferrer nofollow ugc"
        className="text-oro underline underline-offset-2 [overflow-wrap:anywhere] hover:text-paper"
      >
        {t.valor}
      </a>
    ),
  );
}
