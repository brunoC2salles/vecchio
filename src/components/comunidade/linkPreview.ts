import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type PreviaLink = {
  url: string;
  dominio: string;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
};

const TIMEOUT_MS = 4000;
const MAX_REDIRECTS = 3;
const MAX_BYTES = 512 * 1024;
const CACHE_SEGUNDOS = 60 * 60 * 24;

function ipPrivado(ip: string): boolean {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return ipPrivado(v6.slice(7));
  return v6 === "::" || v6 === "::1" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80");
}

async function urlSegura(url: URL): Promise<boolean> {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.port && url.port !== "80" && url.port !== "443") return false;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  try {
    const enderecos = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
    return enderecos.length > 0 && enderecos.every((e) => !ipPrivado(e.address));
  } catch {
    return false;
  }
}

async function lerHtml(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    partes.push(value);
    total += value.length;
  }
  await reader.cancel().catch(() => {});
  return new TextDecoder("utf-8").decode(Buffer.concat(partes).subarray(0, MAX_BYTES));
}

function decodificar(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html: string, nomes: string[]): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const nome of nomes) {
    for (const tag of tags) {
      const chave = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (chave !== nome) continue;
      const conteudo = tag.match(/\bcontent\s*=\s*"([^"]*)"/i)?.[1] ?? tag.match(/\bcontent\s*=\s*'([^']*)'/i)?.[1];
      if (conteudo && conteudo.trim()) return decodificar(conteudo);
    }
  }
  return null;
}

export async function buscarPrevia(urlOriginal: string): Promise<PreviaLink | null> {
  try {
    let atual = new URL(urlOriginal);
    let res: Response | null = null;

    for (let i = 0; i <= MAX_REDIRECTS; i++) {
      if (!(await urlSegura(atual))) return null;
      res = await fetch(atual, {
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; VecchioSchoolBot/1.0; +https://vecchioschool.com.br)",
          accept: "text/html,application/xhtml+xml",
        },
        next: { revalidate: CACHE_SEGUNDOS },
      });
      const destino = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
      if (!destino) break;
      atual = new URL(destino, atual);
      res = null;
    }

    if (!res || !res.ok) return null;
    if (!(res.headers.get("content-type") ?? "").includes("html")) return null;

    const html = await lerHtml(res);
    const tituloTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const titulo = meta(html, ["og:title", "twitter:title"]) ?? (tituloTag ? decodificar(tituloTag) : null);
    if (!titulo) return null;

    const imagemBruta = meta(html, ["og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"]);
    let imagem: string | null = null;
    if (imagemBruta) {
      try {
        const u = new URL(imagemBruta, atual);
        if (u.protocol === "https:") imagem = u.toString();
      } catch {}
    }

    return {
      url: urlOriginal,
      dominio: atual.hostname.replace(/^www\./, ""),
      titulo: titulo.slice(0, 200),
      descricao: meta(html, ["og:description", "twitter:description", "description"])?.slice(0, 300) ?? null,
      imagem,
    };
  } catch {
    return null;
  }
}
