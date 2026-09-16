"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEspaco(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) {
    redirect("/dashboard/comunidade/espacos?error=" + encodeURIComponent("Dê um nome ao espaço."));
  }

  const { error } = await supabase.from("espacos").insert({
    nome,
    tipo: "tema",
    criado_por: user.id,
  });

  if (error) {
    redirect("/dashboard/comunidade/espacos?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/comunidade/espacos");
}
