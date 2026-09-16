import { createClient } from "@/lib/supabase/server";
import { ProducaoForm } from "@/components/cmv/ProducaoForm";
import { createProducao } from "../actions";

export default async function NovaProducaoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: insumos } = await supabase
    .from("insumos")
    .select("id, nome, categoria, tipo, unidade, preco_compra, rendimento, custo_unitario")
    .order("nome");

  return (
    <div>
      <h2 className="font-display text-paper text-2xl">Nova produção interna</h2>
      <div className="mt-6">
        <ProducaoForm action={createProducao} insumos={insumos ?? []} error={error} />
      </div>
    </div>
  );
}
