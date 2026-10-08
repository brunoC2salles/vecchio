"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { confirmarDataMatricula } from "@/lib/turma-datas";

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

  // Se o aluno ainda não escolheu a data da turma presencial, ela vem junto neste formulário.
  const matriculaId = String(formData.get("matricula_id") ?? "");
  if (matriculaId) {
    const turmaDataId = String(formData.get("turma_data_id") ?? "");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?error=" + encodeURIComponent("Sessão expirada. Entre novamente."));
    }

    const erroData = await confirmarDataMatricula(user.id, matriculaId, turmaDataId);
    if (erroData) {
      redirect("/set-password?error=" + encodeURIComponent(erroData));
    }
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/set-password?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard");
}
