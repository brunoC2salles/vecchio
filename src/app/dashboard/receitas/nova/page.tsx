import { createClient } from "@/lib/supabase/server";
import { RecipeBuilder } from "@/components/receitas/RecipeBuilder";
import { createReceita } from "../actions";
import type { CmvConfig } from "@/components/cmv/calculations";

export default async function NovaReceitaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: insumos }, { data: config }] = await Promise.all([
    supabase
      .from("insumos")
      .select("id, nome, categoria, tipo, unidade, preco_compra, rendimento, custo_unitario")
      .order("nome"),
    supabase
      .from("cmv_config")
      .select("cmv_alvo, limite_atencao_baixo, limite_atencao_alto, limite_critico")
      .single(),
  ]);

  const cfg = (config ?? {
    cmv_alvo: 0.32,
    limite_atencao_baixo: 0.25,
    limite_atencao_alto: 0.32,
    limite_critico: 0.38,
  }) as CmvConfig;

  return (
    <div>
      <h1 className="font-display text-paper text-4xl">Nova receita</h1>
      <div className="mt-6">
        <RecipeBuilder action={createReceita} insumos={insumos ?? []} cmvConfig={cfg} error={error} />
      </div>
    </div>
  );
}
