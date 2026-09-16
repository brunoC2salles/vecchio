"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const conteudo = String(formData.get("conteudo") ?? "").trim();
  const midiaUrl = String(formData.get("midia_url") ?? "") || null;
  const espacoId = String(formData.get("espaco_id") ?? "") || null;
  const voltarPara = String(formData.get("voltar_para") ?? "/dashboard/comunidade/feed");

  if (!conteudo) {
    redirect(voltarPara + "?error=" + encodeURIComponent("Escreva algo antes de publicar."));
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    conteudo,
    midia_url: midiaUrl,
    espaco_id: espacoId,
  });

  if (error) {
    redirect(voltarPara + "?error=" + encodeURIComponent(error.message));
  }

  revalidatePath(voltarPara);
}

export async function deletePost(postId: string, voltarPara: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", postId);
  revalidatePath(voltarPara);
}

export async function toggleLike(postId: string, voltarPara: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existente } = await supabase
    .from("curtidas")
    .select("post_id")
    .eq("post_id", postId)
    .eq("author_id", user.id)
    .maybeSingle();

  if (existente) {
    await supabase.from("curtidas").delete().eq("post_id", postId).eq("author_id", user.id);
  } else {
    await supabase.from("curtidas").insert({ post_id: postId, author_id: user.id });
  }

  revalidatePath(voltarPara);
}

export async function addComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const postId = String(formData.get("post_id") ?? "");
  const conteudo = String(formData.get("conteudo") ?? "").trim();
  const voltarPara = String(formData.get("voltar_para") ?? "/dashboard/comunidade/feed");

  if (conteudo && postId) {
    await supabase.from("comentarios").insert({
      post_id: postId,
      author_id: user.id,
      conteudo,
    });
  }

  revalidatePath(voltarPara);
}
