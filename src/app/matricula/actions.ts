"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { compraConfirmadaEmail } from "@/lib/email-templates";

function gerarCodigoAcesso() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function matricular(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim() || null;

  if (!nome || !email) {
    redirect("/matricula?error=" + encodeURIComponent("Preencha nome e e-mail."));
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    redirect("/matricula?error=" + encodeURIComponent((e as Error).message));
  }

  // já matriculado?
  const { data: existente } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (existente) {
    redirect(
      "/matricula?error=" +
        encodeURIComponent("Esse e-mail já tem uma conta na Vecchio School. Use 'Esqueci minha senha' para entrar.")
    );
  }

  const { data: turma } = await admin
    .from("turmas")
    .select("id, nome")
    .eq("status", "ativa")
    .order("data_evento", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!turma) {
    redirect("/matricula?error=" + encodeURIComponent("Nenhuma turma com inscrições abertas no momento."));
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vecchioschool.com.br";

  const { data: linked, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo: `${siteUrl}/auth/callback?next=/set-password` },
  });

  if (error || !linked.user) {
    redirect("/matricula?error=" + encodeURIComponent(error?.message ?? "Erro ao criar sua conta"));
  }

  await admin.from("profiles").update({ nome, telefone }).eq("id", linked.user.id);

  const codigo = gerarCodigoAcesso();

  // modo teste: sem processamento de pagamento real ainda (Stripe entra depois)
  await admin.from("matriculas").insert({
    profile_id: linked.user.id,
    turma_id: turma!.id,
    status: "teste",
    codigo_acesso_presencial: codigo,
  });

  const { subject, html } = compraConfirmadaEmail({
    nome,
    codigo,
    turmaNome: turma!.nome,
    criarContaUrl: linked.properties.action_link,
  });

  await sendEmail({ to: email, subject, html });

  redirect("/matricula?ok=1");
}
