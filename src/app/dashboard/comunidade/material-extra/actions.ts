"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TAMANHO_MAXIMO = 30 * 1024 * 1024; // 30MB
const BUCKET = "material-extra";

function sanitizarNomeArquivo(nome: string) {
  return nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadMaterial(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const arquivo = formData.get("arquivo") as File | null;

  if (!titulo || !arquivo || arquivo.size === 0) {
    redirect("/dashboard/comunidade/material-extra?error=" + encodeURIComponent("Preencha o título e escolha um arquivo."));
  }

  if (arquivo.type !== "application/pdf") {
    redirect("/dashboard/comunidade/material-extra?error=" + encodeURIComponent("Só é possível enviar arquivos PDF."));
  }

  if (arquivo.size > TAMANHO_MAXIMO) {
    redirect("/dashboard/comunidade/material-extra?error=" + encodeURIComponent("O arquivo passa de 30MB."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  const caminho = `${crypto.randomUUID()}-${sanitizarNomeArquivo(arquivo.name)}`;
  const { error: uploadError } = await admin.storage.from(BUCKET).upload(caminho, arquivo, {
    contentType: "application/pdf",
  });

  if (uploadError) {
    redirect("/dashboard/comunidade/material-extra?error=" + encodeURIComponent(uploadError.message));
  }

  const { error: dbError } = await admin.from("materiais_extra").insert({
    titulo,
    descricao,
    arquivo_path: caminho,
    arquivo_nome: arquivo.name,
    tamanho_bytes: arquivo.size,
    criado_por: user?.id ?? null,
  });

  if (dbError) {
    await admin.storage.from(BUCKET).remove([caminho]);
    redirect("/dashboard/comunidade/material-extra?error=" + encodeURIComponent(dbError.message));
  }

  revalidatePath("/dashboard/comunidade/material-extra");
}

export async function excluirMaterial(id: string, caminho: string) {
  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([caminho]);
  await admin.from("materiais_extra").delete().eq("id", id);
  revalidatePath("/dashboard/comunidade/material-extra");
}
