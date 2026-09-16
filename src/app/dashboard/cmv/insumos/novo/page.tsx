import { InsumoForm } from "@/components/cmv/InsumoForm";
import { createInsumo } from "../actions";

export default async function NovoInsumoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h2 className="font-display text-paper text-2xl">Novo insumo</h2>
      <div className="mt-6">
        <InsumoForm action={createInsumo} error={error} />
      </div>
    </div>
  );
}
