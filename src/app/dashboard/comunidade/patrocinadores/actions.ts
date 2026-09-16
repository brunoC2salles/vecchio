"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPatrocinador(formData: FormData) {
  const supabase = await createClient();

  const nomeMarca = String(formData.get("nome_marca") ?? "").trim();
  const logoUrl = String(formData.get("logo_url") ?? "") || null;
  const link = String(formData.get("link") ?? "") || null;
  const profileId = String(formData.get("profile_id") ?? "") || null;

  const { error } = await supabase.from("patrocinadores").insert({
    nome_marca: nomeMarca,
    logo_url: logoUrl,
    link,
    profile_id: profileId,
  });

  if (error) {
    redirect("/dashboard/comunidade/patrocinadores?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/comunidade/patrocinadores");
}

export async function deletePatrocinador(id: string) {
  const supabase = await createClient();
  await supabase.from("patrocinadores").delete().eq("id", id);
  revalidatePath("/dashboard/comunidade/patrocinadores");
}
