"use client";

import { useState } from "react";
import Image from "next/image";

// Adicione a camiseta aqui quando a foto chegar:
// { src: "/img/uniforme/camiseta.jpg", alt: "Camiseta LAB" },
const imagens = [{ src: "/img/uniforme/avental.jpg", alt: "Avental Sauce & Co." }];

export function KitUniformeBadge() {
  const [aberto, setAberto] = useState(false);
  const [indice, setIndice] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndice(0);
          setAberto(true);
        }}
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
              <Image
                src={imagens[indice].src}
                alt={imagens[indice].alt}
                width={900}
                height={1200}
                className="h-auto max-h-[75vh] w-full object-contain"
              />
              <p className="text-smoke px-4 py-3 text-center text-sm">{imagens[indice].alt}</p>
            </div>

            {imagens.length > 1 && (
              <div className="mt-3 flex justify-center gap-2">
                {imagens.map((img, i) => (
                  <button
                    key={img.src}
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
