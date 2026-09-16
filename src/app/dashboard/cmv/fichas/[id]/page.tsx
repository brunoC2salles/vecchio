import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FichaForm } from "@/components/cmv/FichaForm";
import { updateFicha } from "../actions";

export default async function EditarFichaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: ficha }, { data: insumos }, { data: itens }] = await Promise.all([
    supabase
      .from("fichas_tecnicas")
      .select(
        "nome, quantas_pecas, preco_venda_normal, preco_venda_ifood, custo_embalagem, perc_imposto, perc_comissao_ifood"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("insumos")
      .select("id, nome, categoria, tipo, unidade, preco_compra, rendimento, custo_unitario")
      .order("nome"),
    supabase.from("ficha_tecnica_itens").select("insumo_id, quantidade").eq("ficha_tecnica_id", id),
  ]);

  if (!ficha) notFound();

  const action = updateFicha.bind(null, id);

  return (
    <div>
      <h2 className="font-display text-paper text-2xl">Editar ficha técnica</h2>
      <div className="mt-6">
        <FichaForm
          action={action}
          insumos={insumos ?? []}
          ficha={ficha}
          initialItems={itens ?? []}
          error={error}
        />
      </div>
    </div>
  );
}
