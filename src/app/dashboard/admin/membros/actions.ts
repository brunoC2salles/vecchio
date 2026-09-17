"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
