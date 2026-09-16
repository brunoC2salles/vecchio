"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSala(formData: FormData) {
  const supabase = await createClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "") || null;

  const { error } = await supabase.from("salas_de_aula").insert({ nome, descricao });

  if (error) {
    redirect("/dashboard/comunidade/aulas?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/comunidade/aulas");
}

export async function createAula(formData: FormData) {
  const supabase = await createClient();

  const salaId = String(formData.get("sala_id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const urlVideo = String(formData.get("url_video") ?? "").trim();

  const { error } = await supabase.from("aulas").insert({ sala_id: salaId, titulo, url_video: urlVideo });

  if (error) {
    redirect("/dashboard/comunidade/aulas?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/comunidade/aulas");
}

export async function deleteSala(id: string) {
  const supabase = await createClient();
  await supabase.from("salas_de_aula").delete().eq("id", id);
  revalidatePath("/dashboard/comunidade/aulas");
}

export async function deleteAula(id: string) {
  const supabase = await createClient();
  await supabase.from("aulas").delete().eq("id", id);
  revalidatePath("/dashboard/comunidade/aulas");
}
