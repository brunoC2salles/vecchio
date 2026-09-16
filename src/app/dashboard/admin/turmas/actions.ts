"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTurma(formData: FormData) {
  const supabase = await createClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "presencial_comunidade");
  const dataEvento = String(formData.get("data_evento") ?? "");

  await supabase.from("turmas").insert({
    nome,
    tipo,
    data_evento: dataEvento ? new Date(dataEvento).toISOString() : null,
  });

  revalidatePath("/dashboard/admin/turmas");
}

export async function updateTurmaStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("turmas").update({ status }).eq("id", id);
  revalidatePath("/dashboard/admin/turmas");
}

export async function updateMatriculaStatus(id: string, formData: FormData) {
  const supabase = await createClient();
  const status = String(formData.get("status") ?? "teste");
  await supabase.from("matriculas").update({ status }).eq("id", id);
  revalidatePath("/dashboard/admin/turmas");
}
