"use client";

import { useState } from "react";
import Image from "next/image";

const imagens = [
  { src: "/img/uniforme/camiseta-frente.jpg", alt: "Camiseta frente" },
  { src: "/img/uniforme/camiseta-verso.jpg", alt: "Camiseta verso" },
  { src: "/img/uniforme/avental.jpg", alt: "Avental Sauce & Co." },
];

export function KitUniformeBadge() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="bg-rosso text-paper ml-2 inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
      >
        Ver mais
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setAberto(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="text-paper bg-ink/70 absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg"
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="grid gap-4 sm:grid-cols-3">
              {imagens.map((img) => (
                <div key={img.src} className="border-line bg-char overflow-hidden rounded-sm border">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={520}
                    height={700}
                    className="h-auto w-full object-contain"
                  />
                  <p className="text-smoke px-3 py-2 text-center text-sm">{img.alt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
