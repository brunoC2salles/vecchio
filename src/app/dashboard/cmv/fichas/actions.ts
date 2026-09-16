"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ItemLinha } from "@/components/cmv/types";

function parseItems(formData: FormData): ItemLinha[] {
  const raw = String(formData.get("items") ?? "[]");
  try {
    const parsed = JSON.parse(raw) as ItemLinha[];
    return parsed.filter((i) => i.insumo_id && i.quantidade > 0);
  } catch {
    return [];
  }
}

function toNumber(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").replace(",", ".");
  return Number(raw) || 0;
}

export async function createFicha(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items = parseItems(formData);
  if (items.length === 0) {
    redirect("/dashboard/cmv/fichas/novo?error=" + encodeURIComponent("Adicione ao menos um item."));
  }

  const { data: ficha, error } = await supabase
    .from("fichas_tecnicas")
    .insert({
      owner_id: user.id,
      nome: String(formData.get("nome") ?? ""),
      quantas_pecas: Number(formData.get("quantas_pecas") ?? 1),
      preco_venda_normal: toNumber(formData, "preco_venda_normal"),
      preco_venda_ifood: toNumber(formData, "preco_venda_ifood"),
      custo_embalagem: toNumber(formData, "custo_embalagem"),
      perc_imposto: toNumber(formData, "perc_imposto"),
      perc_comissao_ifood: toNumber(formData, "perc_comissao_ifood"),
    })
    .select("id")
    .single();

  if (error || !ficha) {
    redirect("/dashboard/cmv/fichas/novo?error=" + encodeURIComponent(error?.message ?? "Erro ao criar"));
  }

  const { error: itensError } = await supabase.from("ficha_tecnica_itens").insert(
    items.map((i) => ({
      ficha_tecnica_id: ficha!.id,
      insumo_id: i.insumo_id,
      quantidade: i.quantidade,
    }))
  );

  if (itensError) {
    redirect("/dashboard/cmv/fichas/novo?error=" + encodeURIComponent(itensError.message));
  }

  revalidatePath("/dashboard/cmv/fichas");
  redirect("/dashboard/cmv/fichas");
}

export async function updateFicha(id: string, formData: FormData) {
  const supabase = await createClient();
  const items = parseItems(formData);

  const { error } = await supabase
    .from("fichas_tecnicas")
    .update({
      nome: String(formData.get("nome") ?? ""),
      quantas_pecas: Number(formData.get("quantas_pecas") ?? 1),
      preco_venda_normal: toNumber(formData, "preco_venda_normal"),
      preco_venda_ifood: toNumber(formData, "preco_venda_ifood"),
      custo_embalagem: toNumber(formData, "custo_embalagem"),
      perc_imposto: toNumber(formData, "perc_imposto"),
      perc_comissao_ifood: toNumber(formData, "perc_comissao_ifood"),
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/cmv/fichas/${id}?error=` + encodeURIComponent(error.message));
  }

  await supabase.from("ficha_tecnica_itens").delete().eq("ficha_tecnica_id", id);

  if (items.length > 0) {
    const { error: itensError } = await supabase.from("ficha_tecnica_itens").insert(
      items.map((i) => ({
        ficha_tecnica_id: id,
        insumo_id: i.insumo_id,
        quantidade: i.quantidade,
      }))
    );
    if (itensError) {
      redirect(`/dashboard/cmv/fichas/${id}?error=` + encodeURIComponent(itensError.message));
    }
  }

  revalidatePath("/dashboard/cmv/fichas");
  redirect("/dashboard/cmv/fichas");
}

export async function deleteFicha(id: string) {
  const supabase = await createClient();
  await supabase.from("fichas_tecnicas").delete().eq("id", id);
  revalidatePath("/dashboard/cmv/fichas");
  redirect("/dashboard/cmv/fichas");
}
