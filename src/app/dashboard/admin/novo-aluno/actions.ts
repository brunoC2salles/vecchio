"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

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

  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/set-password`,
  });

  if (error || !invited.user) {
    redirect("/dashboard/admin/novo-aluno?error=" + encodeURIComponent(error?.message ?? "Erro ao convidar"));
  }

  const supabase = await createClient();

  await supabase.from("profiles").update({ nome }).eq("id", invited.user.id);

  if (turmaId) {
    await supabase.from("matriculas").insert({
      profile_id: invited.user.id,
      turma_id: turmaId,
      status: "pago",
      codigo_acesso_presencial: gerarCodigoAcesso(),
    });
  }

  redirect("/dashboard/admin/novo-aluno?ok=1");
}
