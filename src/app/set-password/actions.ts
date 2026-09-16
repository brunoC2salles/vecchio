"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function setPassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (password.length < 8) {
    redirect("/set-password?error=" + encodeURIComponent("A senha precisa ter ao menos 8 caracteres."));
  }

  if (password !== confirmar) {
    redirect("/set-password?error=" + encodeURIComponent("As senhas não coincidem."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/set-password?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard");
}
