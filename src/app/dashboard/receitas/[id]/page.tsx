import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecipeBuilder } from "@/components/receitas/RecipeBuilder";
import { updateReceita, deleteReceita } from "../actions";
import type { CmvConfig } from "@/components/cmv/calculations";

export default async function ReceitaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { id } = await params;
  const { error, ok } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: receita }, { data: itens }, { data: insumos }, { data: config }] = await Promise.all([
    supabase.from("receitas").select("nome, descricao, publica, preco_venda_sugerido, owner_id").eq("id", id).single(),
    supabase
      .from("receita_itens")
      .select("insumo_id, quantidade, nome, unidade, custo_unitario")
      .eq("receita_id", id),
    supabase
      .from("insumos")
      .select("id, nome, categoria, tipo, unidade, preco_compra, rendimento, custo_unitario")
      .order("nome"),
    supabase
      .from("cmv_config")
      .select("cmv_alvo, limite_atencao_baixo, limite_atencao_alto, limite_critico")
      .single(),
  ]);

  if (!receita) notFound();

  const isOwner = receita.owner_id === user!.id;
  const cfg = (config ?? {
    cmv_alvo: 0.32,
    limite_atencao_baixo: 0.25,
    limite_atencao_alto: 0.32,
    limite_critico: 0.38,
  }) as CmvConfig;

  const action = updateReceita.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-paper text-4xl">{isOwner ? "Editar receita" : receita.nome}</h1>
        {isOwner && (
          <form action={deleteReceita.bind(null, id)}>
            <button type="submit" className="text-rosso text-xs underline underline-offset-2">
              excluir receita
            </button>
          </form>
        )}
      </div>

      {ok && <p className="border-line text-paper mt-4 rounded-sm border px-4 py-3 text-sm">Receita salva.</p>}

      <div className="mt-6">
        <RecipeBuilder
          action={action}
          insumos={isOwner ? insumos ?? [] : []}
          cmvConfig={cfg}
          initial={receita}
          initialItems={itens ?? []}
          error={error}
          readOnly={!isOwner}
        />
      </div>
    </div>
  );
}
