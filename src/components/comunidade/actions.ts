"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { novoComentarioEmail, novoPostEmail } from "@/lib/email-templates";
import { labelDoTopico } from "./topicos";

// Responsável por acompanhar as dúvidas da comunidade: recebe um aviso a cada post e comentário.
const EMAIL_RESPONSAVEL_DUVIDAS = "lmolzlara@gmail.com";

function urlDoFeed(topicos: string[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vecchioschool.com.br";
  const base = `${siteUrl}/dashboard/comunidade/feed`;
  return topicos.length === 1 ? `${base}?topico=${topicos[0]}` : base;
}

// Retorna o nome do autor, ou null quando o aviso não deve ser enviado (autor admin).
async function autorParaAviso(supabase: SupabaseClient, userId: string) {
  const { data: perfil } = await supabase.from("profiles").select("nome, role").eq("id", userId).single();
  if (!perfil || perfil.role === "admin") return null;
  return perfil.nome || "Um aluno";
}

// Falha no envio nunca impede a publicação: só registra o erro.
async function enviarAviso(email: { subject: string; html: string }) {
  try {
    await sendEmail({ to: EMAIL_RESPONSAVEL_DUVIDAS, ...email });
  } catch (e) {
    console.error("Falha ao avisar o responsável pelas dúvidas:", e);
  }
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const conteudo = String(formData.get("conteudo") ?? "").trim();
  const midiaUrl = String(formData.get("midia_url") ?? "") || null;
  const topicos = formData.getAll("topicos").map(String);
  const voltarPara = String(formData.get("voltar_para") ?? "/dashboard/comunidade/feed");

  if (!conteudo) {
    redirect(voltarPara + "?error=" + encodeURIComponent("Escreva algo antes de publicar."));
  }

  if (topicos.length === 0) {
    redirect(voltarPara + "?error=" + encodeURIComponent("Escolha pelo menos um tópico."));
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    conteudo,
    midia_url: midiaUrl,
    topicos,
  });

  if (error) {
    redirect(voltarPara + "?error=" + encodeURIComponent(error.message));
  }

  const autorNome = await autorParaAviso(supabase, user.id);
  if (autorNome) {
    await enviarAviso(
      novoPostEmail({
        autorNome,
        topicos: topicos.map(labelDoTopico),
        conteudo,
        url: urlDoFeed(topicos),
      })
    );
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
    const { error } = await supabase.from("comentarios").insert({
      post_id: postId,
      author_id: user.id,
      conteudo,
    });

    if (!error) {
      const autorNome = await autorParaAviso(supabase, user.id);
      if (autorNome) {
        const { data: post } = await supabase
          .from("posts")
          .select("conteudo, topicos")
          .eq("id", postId)
          .single();
        const topicosPost: string[] = post?.topicos ?? [];

        await enviarAviso(
          novoComentarioEmail({
            autorNome,
            topicos: topicosPost.map(labelDoTopico),
            comentario: conteudo,
            postConteudo: post?.conteudo ?? "",
            url: urlDoFeed(topicosPost),
          })
        );
      }
    }
  }

  revalidatePath(voltarPara);
}
