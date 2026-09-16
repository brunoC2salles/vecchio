"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function toNumber(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").replace(",", ".");
  return Number(raw);
}

export async function createInsumo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("insumos").insert({
    owner_id: user.id,
    nome: String(formData.get("nome") ?? ""),
    categoria: String(formData.get("categoria") ?? "") || null,
    unidade: String(formData.get("unidade") ?? ""),
    preco_compra: toNumber(formData, "preco_compra"),
    rendimento: toNumber(formData, "rendimento") || 1,
  });

  if (error) {
    redirect("/dashboard/cmv/insumos/novo?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/cmv/insumos");
  redirect("/dashboard/cmv/insumos");
}

export async function updateInsumo(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("insumos")
    .update({
      nome: String(formData.get("nome") ?? ""),
      categoria: String(formData.get("categoria") ?? "") || null,
      unidade: String(formData.get("unidade") ?? ""),
      preco_compra: toNumber(formData, "preco_compra"),
      rendimento: toNumber(formData, "rendimento") || 1,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/cmv/insumos/${id}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard/cmv/insumos");
  redirect("/dashboard/cmv/insumos");
}

export async function deleteInsumo(id: string) {
  const supabase = await createClient();
  await supabase.from("insumos").delete().eq("id", id);
  revalidatePath("/dashboard/cmv/insumos");
  redirect("/dashboard/cmv/insumos");
}
