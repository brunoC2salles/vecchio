"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updatePerfil(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "") || null;
  const bio = String(formData.get("bio") ?? "") || null;
  const avatarUrl = String(formData.get("avatar_url") ?? "") || null;

  const update: Record<string, string | null> = { nome, telefone, bio };
  if (avatarUrl) update.avatar_url = avatarUrl;

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);

  if (error) {
    redirect("/dashboard/perfil?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
  redirect("/dashboard/perfil?ok=1");
}

export async function changePassword(formData: FormData) {
  const senha = String(formData.get("senha") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (senha.length < 8) {
    redirect("/dashboard/perfil?error=" + encodeURIComponent("A senha precisa ter ao menos 8 caracteres."));
  }
  if (senha !== confirmar) {
    redirect("/dashboard/perfil?error=" + encodeURIComponent("As senhas não coincidem."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    redirect("/dashboard/perfil?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard/perfil?senha_ok=1");
}
