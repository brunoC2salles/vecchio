import { createClient } from "@/lib/supabase/server";
import { FichaForm } from "@/components/cmv/FichaForm";
import { createFicha } from "../actions";

export default async function NovaFichaPage({
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
      <h2 className="font-display text-paper text-2xl">Nova ficha técnica</h2>
      <div className="mt-6">
        <FichaForm action={createFicha} insumos={insumos ?? []} error={error} />
      </div>
    </div>
  );
}
