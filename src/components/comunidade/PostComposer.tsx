"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createPost } from "./actions";
import { TOPICOS } from "./topicos";

type PostComposerProps = {
  voltarPara: string;
  error?: string;
};

export function PostComposer({ voltarPara, error }: PostComposerProps) {
  const [midiaUrl, setMidiaUrl] = useState<string | null>(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroUpload, setErroUpload] = useState<string | null>(null);
  const [topicosSelecionados, setTopicosSelecionados] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviandoImagem(true);
    setErroUpload(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErroUpload("Sessão expirada. Recarregue a página.");
      setEnviandoImagem(false);
      return;
    }

    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("post-media").upload(path, file);

    if (uploadError) {
      setErroUpload(uploadError.message);
      setEnviandoImagem(false);
      return;
    }

    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    setMidiaUrl(data.publicUrl);
    setEnviandoImagem(false);
  }

  function alternarTopico(valor: string) {
    setTopicosSelecionados((atual) => (atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor]));
  }

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createPost(formData);
        formRef.current?.reset();
        setMidiaUrl(null);
        setTopicosSelecionados([]);
      }}
      className="border-line bg-char rounded-sm border p-4"
    >
      {error && <p className="border-rosso text-rosso mb-3 rounded-sm border px-4 py-3 text-sm">{error}</p>}
      {erroUpload && <p className="border-rosso text-rosso mb-3 rounded-sm border px-4 py-3 text-sm">{erroUpload}</p>}

      <input type="hidden" name="voltar_para" value={voltarPara} />
      <input type="hidden" name="midia_url" value={midiaUrl ?? ""} />
      {topicosSelecionados.map((t) => (
        <input key={t} type="hidden" name="topicos" value={t} />
      ))}

      <textarea
        name="conteudo"
        required
        rows={3}
        placeholder="Compartilhe algo com a comunidade..."
        className="border-line bg-ink text-paper w-full resize-none rounded-sm border px-3 py-2 outline-none focus:border-rosso"
      />

      {midiaUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={midiaUrl} alt="Prévia da imagem" className="mt-3 max-h-56 rounded-sm object-cover" />
      )}

      <div className="mt-3">
        <p className="text-smoke text-xs">Sobre qual tópico você está falando?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TOPICOS.map((t) => {
            const ativo = topicosSelecionados.includes(t.valor);
            return (
              <button
                key={t.valor}
                type="button"
                onClick={() => alternarTopico(t.valor)}
                className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors ${
                  ativo ? "bg-rosso text-paper" : "border-rosso text-rosso border"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="text-smoke hover:text-paper cursor-pointer text-sm underline underline-offset-2">
          {enviandoImagem ? "Enviando..." : midiaUrl ? "Trocar imagem" : "Adicionar imagem"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={enviandoImagem} />
        </label>

        <button
          type="submit"
          disabled={enviandoImagem || topicosSelecionados.length === 0}
          className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide disabled:opacity-50"
        >
          Publicar
        </button>
      </div>
    </form>
  );
}
