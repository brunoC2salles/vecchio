"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createPost } from "./actions";

type PostComposerProps = {
  espacoId: string | null;
  voltarPara: string;
  error?: string;
};

export function PostComposer({ espacoId, voltarPara, error }: PostComposerProps) {
  const [midiaUrl, setMidiaUrl] = useState<string | null>(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroUpload, setErroUpload] = useState<string | null>(null);
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

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createPost(formData);
        formRef.current?.reset();
        setMidiaUrl(null);
      }}
      className="border-line bg-char rounded-sm border p-4"
    >
      {error && <p className="border-rosso text-rosso mb-3 rounded-sm border px-4 py-3 text-sm">{error}</p>}
      {erroUpload && <p className="border-rosso text-rosso mb-3 rounded-sm border px-4 py-3 text-sm">{erroUpload}</p>}

      <input type="hidden" name="espaco_id" value={espacoId ?? ""} />
      <input type="hidden" name="voltar_para" value={voltarPara} />
      <input type="hidden" name="midia_url" value={midiaUrl ?? ""} />

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

      <div className="mt-3 flex items-center justify-between">
        <label className="text-smoke hover:text-paper cursor-pointer text-sm underline underline-offset-2">
          {enviandoImagem ? "Enviando..." : midiaUrl ? "Trocar imagem" : "Adicionar imagem"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={enviandoImagem} />
        </label>

        <button
          type="submit"
          disabled={enviandoImagem}
          className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide disabled:opacity-50"
        >
          Publicar
        </button>
      </div>
    </form>
  );
}
