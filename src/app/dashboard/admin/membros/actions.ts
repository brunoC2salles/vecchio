"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateMembro(id: string, formData: FormData) {
  const supabase = await createClient();

  const role = String(formData.get("role") ?? "aluno");
  const isPatrocinador = formData.get("is_patrocinador") === "on";

  await supabase.from("profiles").update({ role, is_patrocinador: isPatrocinador }).eq("id", id);

  revalidatePath("/dashboard/admin/membros");
}
