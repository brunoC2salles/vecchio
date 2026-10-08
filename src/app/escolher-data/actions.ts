"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { confirmarDataMatricula } from "@/lib/turma-datas";

export async function escolherData(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const matriculaId = String(formData.get("matricula_id") ?? "");
  const turmaDataId = String(formData.get("turma_data_id") ?? "");

  const erro = await confirmarDataMatricula(user.id, matriculaId, turmaDataId);
  if (erro) {
    redirect("/escolher-data?error=" + encodeURIComponent(erro));
  }

  redirect("/dashboard");
}
