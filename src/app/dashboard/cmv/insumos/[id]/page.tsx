import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InsumoForm } from "@/components/cmv/InsumoForm";
import { updateInsumo } from "../actions";

export default async function EditarInsumoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: insumo } = await supabase
    .from("insumos")
    .select("id, nome, categoria, tipo, unidade, preco_compra, rendimento, custo_unitario")
    .eq("id", id)
    .single();

  if (!insumo) notFound();

  const action = updateInsumo.bind(null, id);

  return (
    <div>
      <h2 className="font-display text-paper text-2xl">Editar insumo</h2>
      <div className="mt-6">
        <InsumoForm action={action} insumo={insumo} error={error} />
      </div>
    </div>
  );
}
