"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEvento(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const titulo = String(formData.get("titulo") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "online");
  const dataEvento = String(formData.get("data_evento") ?? "");
  const localOuLink = String(formData.get("local_ou_link") ?? "") || null;

  const { error } = await supabase.from("eventos").insert({
    titulo,
    tipo,
    data_evento: dataEvento ? new Date(dataEvento).toISOString() : null,
    local_ou_link: localOuLink,
    criado_por: user.id,
  });

  if (error) {
    redirect("/dashboard/comunidade/eventos?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/comunidade/eventos");
}

export async function deleteEvento(id: string) {
  const supabase = await createClient();
  await supabase.from("eventos").delete().eq("id", id);
  revalidatePath("/dashboard/comunidade/eventos");
}
