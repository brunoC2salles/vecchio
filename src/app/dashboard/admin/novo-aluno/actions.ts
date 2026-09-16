"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { compraConfirmadaEmail } from "@/lib/email-templates";

function gerarCodigoAcesso() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function convidarAluno(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const turmaId = String(formData.get("turma_id") ?? "") || null;

  if (!email || !nome) {
    redirect("/dashboard/admin/novo-aluno?error=" + encodeURIComponent("Preencha nome e e-mail."));
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    redirect("/dashboard/admin/novo-aluno?error=" + encodeURIComponent((e as Error).message));
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vecchioschool.com.br";

  const { data: linked, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo: `${siteUrl}/auth/callback?next=/set-password` },
  });

  if (error || !linked.user) {
    redirect("/dashboard/admin/novo-aluno?error=" + encodeURIComponent(error?.message ?? "Erro ao criar conta"));
  }

  const supabase = await createClient();

  await supabase.from("profiles").update({ nome }).eq("id", linked.user.id);

  let turmaNome = "Vecchio School";
  let codigo = "";

  if (turmaId) {
    const { data: turma } = await supabase.from("turmas").select("nome").eq("id", turmaId).single();
    turmaNome = turma?.nome ?? turmaNome;
    codigo = gerarCodigoAcesso();

    await supabase.from("matriculas").insert({
      profile_id: linked.user.id,
      turma_id: turmaId,
      status: "pago",
      codigo_acesso_presencial: codigo,
    });
  }

  const { subject, html } = compraConfirmadaEmail({
    nome,
    codigo: codigo || "—",
    turmaNome,
    criarContaUrl: linked.properties.action_link,
  });

  await sendEmail({ to: email, subject, html });

  redirect("/dashboard/admin/novo-aluno?ok=1");
}
