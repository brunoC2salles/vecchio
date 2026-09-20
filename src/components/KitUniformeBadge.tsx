"use client";

import { useState } from "react";
import Image from "next/image";

type ImagemUniforme = {
  id: string;
  alt: string;
  src?: string;
  dinamica?: boolean;
};

const imagens: ImagemUniforme[] = [
  { id: "camiseta-frente", alt: "Camiseta frente", dinamica: true },
  { id: "camiseta-verso", alt: "Camiseta verso", dinamica: true },
  { id: "avental", alt: "Avental Sauce & Co.", src: "/img/uniforme/avental.jpg" },
];

export function KitUniformeBadge() {
  const [aberto, setAberto] = useState(false);
  const [indice, setIndice] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [dataUrls, setDataUrls] = useState<Record<string, string>>({});

  async function abrir() {
    setIndice(0);
    setAberto(true);

    if (dataUrls["camiseta-frente"] && dataUrls["camiseta-verso"]) return;

    setCarregando(true);
    try {
      const { camisetaFrenteDataUrl, camisetaVersoDataUrl } = await import("./kitUniformeImages");
      setDataUrls({
        "camiseta-frente": camisetaFrenteDataUrl,
        "camiseta-verso": camisetaVersoDataUrl,
      });
    } finally {
      setCarregando(false);
    }
  }

  const atual = imagens[indice];
  const src = atual.dinamica ? dataUrls[atual.id] : atual.src;

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="bg-rosso text-paper ml-2 inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
      >
        Ver mais
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setAberto(false)}
        >
          <div className="relative max-h-[85vh] max-w-md" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="text-paper bg-ink/70 absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg"
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="border-line bg-char overflow-hidden rounded-sm border">
              {src ? (
                <Image
                  src={src}
                  alt={atual.alt}
                  width={900}
                  height={1200}
                  unoptimized={atual.dinamica}
                  className="h-auto max-h-[75vh] w-full object-contain"
                />
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-smoke text-sm">{carregando ? "Carregando..." : ""}</p>
                </div>
              )}
              <p className="text-smoke px-4 py-3 text-center text-sm">{atual.alt}</p>
            </div>

            {imagens.length > 1 && (
              <div className="mt-3 flex justify-center gap-2">
                {imagens.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setIndice(i)}
                    className={`h-2 w-2 rounded-full ${i === indice ? "bg-rosso" : "bg-line"}`}
                    aria-label={`Ver ${img.alt}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
