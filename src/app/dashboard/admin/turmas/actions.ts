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

export async function excluirMatricula(id: string) {
  // Remove só a matrícula (a conta do aluno continua existindo). Para excluir
  // o aluno inteiro, use a página de Membros.
  const supabase = await createClient();
  await supabase.from("matriculas").delete().eq("id", id);
  revalidatePath("/dashboard/admin/turmas");
}

export async function updateTurmaLinksAsaas(id: string, formData: FormData) {
  const supabase = await createClient();
  const pix = String(formData.get("asaas_payment_link_id_pix") ?? "").trim() || null;
  const cartao = String(formData.get("asaas_payment_link_id_cartao") ?? "").trim() || null;

  await supabase
    .from("turmas")
    .update({ asaas_payment_link_id_pix: pix, asaas_payment_link_id_cartao: cartao })
    .eq("id", id);

  revalidatePath("/dashboard/admin/turmas");
}
