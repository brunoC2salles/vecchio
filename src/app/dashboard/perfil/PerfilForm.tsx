"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updatePerfil } from "./actions";

type PerfilFormProps = {
  nome: string;
  telefone: string;
  bio: string;
  avatarAtual: string | null;
};

export function PerfilForm({ nome, telefone, bio, avatarAtual }: PerfilFormProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(avatarAtual);
  const [enviando, setEnviando] = useState(false);
  const [erroUpload, setErroUpload] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviando(true);
    setErroUpload(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErroUpload("Sessão expirada. Recarregue a página.");
      setEnviando(false);
      return;
    }

    const path = `${user.id}/avatar-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);

    if (error) {
      setErroUpload(error.message);
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setEnviando(false);
  }

  return (
    <form action={updatePerfil} className="border-line bg-char max-w-md rounded-sm border p-6">
      {erroUpload && <p className="border-rosso text-rosso mb-4 rounded-sm border px-4 py-3 text-sm">{erroUpload}</p>}

      <input type="hidden" name="avatar_url" value={avatarUrl ?? ""} />

      <div className="flex items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="bg-ink border-line h-16 w-16 rounded-full border" />
        )}
        <label className="text-smoke hover:text-paper cursor-pointer text-sm underline underline-offset-2">
          {enviando ? "Enviando..." : "Trocar foto"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={enviando} />
        </label>
      </div>

      <div className="mt-5">
        <label className="text-smoke text-sm">Nome</label>
        <input
          name="nome"
          required
          defaultValue={nome}
          className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
        />
      </div>

      <div className="mt-4">
        <label className="text-smoke text-sm">Telefone</label>
        <input
          name="telefone"
          defaultValue={telefone}
          placeholder="(55) 99999-9999"
          className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
        />
      </div>

      <div className="mt-4">
        <label className="text-smoke text-sm">Bio</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={bio}
          placeholder="Conte um pouco sobre você"
          className="border-line bg-ink text-paper mt-1 w-full resize-none rounded-sm border px-3 py-2 outline-none focus:border-rosso"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="font-display bg-rosso text-paper mt-5 rounded-sm px-6 py-2.5 text-base tracking-wide disabled:opacity-50"
      >
        Salvar perfil
      </button>
    </form>
  );
}
