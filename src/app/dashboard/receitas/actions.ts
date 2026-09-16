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

export async function createReceita(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items = parseItems(formData);
  if (items.length === 0) {
    redirect("/dashboard/receitas/nova?error=" + encodeURIComponent("Adicione ao menos um ingrediente."));
  }

  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "") || null;
  const publica = formData.get("publica") === "on";
  const precoRaw = String(formData.get("preco_venda_sugerido") ?? "");
  const precoVendaSugerido = precoRaw ? Number(precoRaw) : null;

  const { data: receita, error } = await supabase
    .from("receitas")
    .insert({ owner_id: user.id, nome, descricao, publica, preco_venda_sugerido: precoVendaSugerido })
    .select("id")
    .single();

  if (error || !receita) {
    redirect("/dashboard/receitas/nova?error=" + encodeURIComponent(error?.message ?? "Erro ao criar"));
  }

  const { data: insumosUsados } = await supabase
    .from("insumos")
    .select("id, nome, unidade, custo_unitario")
    .in("id", items.map((i) => i.insumo_id));

  const { error: itensError } = await supabase.from("receita_itens").insert(
    items.map((i) => {
      const insumo = insumosUsados?.find((ins) => ins.id === i.insumo_id);
      return {
        receita_id: receita!.id,
        insumo_id: i.insumo_id,
        quantidade: i.quantidade,
        nome: insumo?.nome ?? "Insumo",
        unidade: insumo?.unidade ?? "",
        custo_unitario: insumo?.custo_unitario ?? 0,
      };
    })
  );

  if (itensError) {
    redirect("/dashboard/receitas/nova?error=" + encodeURIComponent(itensError.message));
  }

  revalidatePath("/dashboard/receitas");
  redirect(`/dashboard/receitas/${receita!.id}`);
}

export async function updateReceita(id: string, formData: FormData) {
  const supabase = await createClient();
  const items = parseItems(formData);

  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "") || null;
  const publica = formData.get("publica") === "on";
  const precoRaw = String(formData.get("preco_venda_sugerido") ?? "");
  const precoVendaSugerido = precoRaw ? Number(precoRaw) : null;

  const { error } = await supabase
    .from("receitas")
    .update({ nome, descricao, publica, preco_venda_sugerido: precoVendaSugerido, atualizado_em: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/receitas/${id}?error=` + encodeURIComponent(error.message));
  }

  await supabase.from("receita_itens").delete().eq("receita_id", id);

  if (items.length > 0) {
    const { data: insumosUsados } = await supabase
      .from("insumos")
      .select("id, nome, unidade, custo_unitario")
      .in("id", items.map((i) => i.insumo_id));

    const { error: itensError } = await supabase.from("receita_itens").insert(
      items.map((i) => {
        const insumo = insumosUsados?.find((ins) => ins.id === i.insumo_id);
        return {
          receita_id: id,
          insumo_id: i.insumo_id,
          quantidade: i.quantidade,
          nome: insumo?.nome ?? "Insumo",
          unidade: insumo?.unidade ?? "",
          custo_unitario: insumo?.custo_unitario ?? 0,
        };
      })
    );
    if (itensError) {
      redirect(`/dashboard/receitas/${id}?error=` + encodeURIComponent(itensError.message));
    }
  }

  revalidatePath("/dashboard/receitas");
  revalidatePath(`/dashboard/receitas/${id}`);
  redirect(`/dashboard/receitas/${id}?ok=1`);
}

export async function deleteReceita(id: string) {
  const supabase = await createClient();
  await supabase.from("receitas").delete().eq("id", id);
  revalidatePath("/dashboard/receitas");
  redirect("/dashboard/receitas");
}
