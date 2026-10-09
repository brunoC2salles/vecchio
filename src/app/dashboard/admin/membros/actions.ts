"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { novoLinkAcessoEmail } from "@/lib/email-templates";
import { linkConfirmacaoAuth } from "@/lib/auth-links";

export async function updateMembro(id: string, formData: FormData) {
  const supabase = await createClient();

  const role = String(formData.get("role") ?? "aluno");
  const isPatrocinador = formData.get("is_patrocinador") === "on";

  await supabase.from("profiles").update({ role, is_patrocinador: isPatrocinador }).eq("id", id);

  revalidatePath("/dashboard/admin/membros");
}

export async function excluirMembro(id: string) {
  // Exclui o usuário no Auth; profiles, matriculas, posts, comentários etc. do
  // membro são removidos em cascata (ON DELETE CASCADE no banco).
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    console.error("Falha ao excluir membro:", error);
    return;
  }

  revalidatePath("/dashboard/admin/membros");
  revalidatePath("/dashboard/admin/turmas");
}

// Alunos com matrícula ativa que ainda não criaram a própria senha.
export async function listarSemSenha() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, nome, email, matriculas!inner(status)")
    .eq("senha_definida", false)
    .neq("role", "admin")
    .neq("matriculas.status", "cancelado");

  const vistos = new Set<string>();
  return (data ?? []).filter((p) => {
    if (!p.email || vistos.has(p.id)) return false;
    vistos.add(p.id);
    return true;
  });
}

export async function reenviarLinksSemSenha() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: perfil } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (perfil?.role !== "admin") redirect("/dashboard");

  const admin = createAdminClient();
  const pendentes = await listarSemSenha();

  let enviados = 0;
  const falhas: string[] = [];

  for (const p of pendentes) {
    try {
      const { data: linked, error } = await admin.auth.admin.generateLink({
        type: "recovery",
        email: p.email,
      });
      if (error || !linked?.properties?.hashed_token) {
        throw error ?? new Error("link não gerado");
      }

      const nome = (p.nome ?? "").split(" ")[0] || "aluno";
      const { subject, html } = novoLinkAcessoEmail({
        nome,
        url: linkConfirmacaoAuth(linked.properties.hashed_token, "recovery", true),
      });
      await sendEmail({ to: p.email, subject, html });
      enviados++;
    } catch (e) {
      console.error("Falha ao reenviar link para", p.email, e);
      falhas.push(p.email);
    }

    // Respeita o limite de envios por segundo do Resend.
    await new Promise((r) => setTimeout(r, 600));
  }

  revalidatePath("/dashboard/admin/membros");
  const params = new URLSearchParams({ reenvio: String(enviados) });
  if (falhas.length) params.set("falhas", falhas.join(", "));
  redirect("/dashboard/admin/membros?" + params.toString());
}
