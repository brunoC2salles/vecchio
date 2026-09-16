import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProducaoForm } from "@/components/cmv/ProducaoForm";
import { updateProducao } from "../actions";

export default async function EditarProducaoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: producao }, { data: insumos }, { data: itens }] = await Promise.all([
    supabase.from("producoes_internas").select("nome, rendimento_qtd, rendimento_unidade").eq("id", id).single(),
    supabase
      .from("insumos")
      .select("id, nome, categoria, tipo, unidade, preco_compra, rendimento, custo_unitario")
      .order("nome"),
    supabase.from("producao_interna_itens").select("insumo_id, quantidade").eq("producao_interna_id", id),
  ]);

  if (!producao) notFound();

  const action = updateProducao.bind(null, id);

  return (
    <div>
      <h2 className="font-display text-paper text-2xl">Editar produção interna</h2>
      <div className="mt-6">
        <ProducaoForm
          action={action}
          insumos={insumos ?? []}
          producao={producao}
          initialItems={itens ?? []}
          error={error}
        />
      </div>
    </div>
  );
}
