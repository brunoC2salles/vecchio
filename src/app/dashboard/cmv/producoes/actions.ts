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

export async function createProducao(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items = parseItems(formData);
  if (items.length === 0) {
    redirect("/dashboard/cmv/producoes/novo?error=" + encodeURIComponent("Adicione ao menos um item."));
  }

  const { data: producao, error } = await supabase
    .from("producoes_internas")
    .insert({
      owner_id: user.id,
      nome: String(formData.get("nome") ?? ""),
      rendimento_qtd: Number(formData.get("rendimento_qtd") ?? 0),
      rendimento_unidade: String(formData.get("rendimento_unidade") ?? ""),
    })
    .select("id")
    .single();

  if (error || !producao) {
    redirect("/dashboard/cmv/producoes/novo?error=" + encodeURIComponent(error?.message ?? "Erro ao criar"));
  }

  const { error: itensError } = await supabase.from("producao_interna_itens").insert(
    items.map((i) => ({
      producao_interna_id: producao!.id,
      insumo_id: i.insumo_id,
      quantidade: i.quantidade,
    }))
  );

  if (itensError) {
    redirect("/dashboard/cmv/producoes/novo?error=" + encodeURIComponent(itensError.message));
  }

  revalidatePath("/dashboard/cmv/producoes");
  revalidatePath("/dashboard/cmv/insumos");
  redirect("/dashboard/cmv/producoes");
}

export async function updateProducao(id: string, formData: FormData) {
  const supabase = await createClient();
  const items = parseItems(formData);

  const { error } = await supabase
    .from("producoes_internas")
    .update({
      nome: String(formData.get("nome") ?? ""),
      rendimento_qtd: Number(formData.get("rendimento_qtd") ?? 0),
      rendimento_unidade: String(formData.get("rendimento_unidade") ?? ""),
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/cmv/producoes/${id}?error=` + encodeURIComponent(error.message));
  }

  await supabase.from("producao_interna_itens").delete().eq("producao_interna_id", id);

  if (items.length > 0) {
    const { error: itensError } = await supabase.from("producao_interna_itens").insert(
      items.map((i) => ({
        producao_interna_id: id,
        insumo_id: i.insumo_id,
        quantidade: i.quantidade,
      }))
    );
    if (itensError) {
      redirect(`/dashboard/cmv/producoes/${id}?error=` + encodeURIComponent(itensError.message));
    }
  }

  revalidatePath("/dashboard/cmv/producoes");
  revalidatePath("/dashboard/cmv/insumos");
  redirect("/dashboard/cmv/producoes");
}

export async function deleteProducao(id: string) {
  const supabase = await createClient();
  await supabase.from("producoes_internas").delete().eq("id", id);
  revalidatePath("/dashboard/cmv/producoes");
  revalidatePath("/dashboard/cmv/insumos");
  redirect("/dashboard/cmv/producoes");
}
