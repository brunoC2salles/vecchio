"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { recuperarSenhaEmail } from "@/lib/email-templates";

export async function solicitarRecuperacao(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect("/esqueci-senha?error=" + encodeURIComponent("Informe seu e-mail."));
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    redirect("/esqueci-senha?error=" + encodeURIComponent((e as Error).message));
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vecchioschool.com.br";

  const { data: linked, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${siteUrl}/auth/callback?next=/set-password` },
  });

  // Não revela se o e-mail existe ou não — sempre mostra a mesma mensagem de sucesso.
  if (!error && linked?.user) {
    const { data: profile } = await admin.from("profiles").select("nome").eq("id", linked.user.id).single();
    const nome = profile?.nome?.split(" ")[0] ?? "aluno";

    const { subject, html } = recuperarSenhaEmail({ nome, resetUrl: linked.properties.action_link });

    try {
      await sendEmail({ to: email, subject, html });
    } catch {
      // e-mail pode falhar silenciosamente aqui para não revelar existência da conta
    }
  }

  redirect("/esqueci-senha?ok=1");
}
