import { createClient } from "@/lib/supabase/server";
import { updateCmvConfig } from "./actions";

export default async function ConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const supabase = await createClient();
  const { data: config } = await supabase
    .from("cmv_config")
    .select("cmv_alvo, limite_atencao_baixo, limite_atencao_alto, limite_critico")
    .single();

  return (
    <div className="max-w-md">
      <p className="text-smoke text-sm">
        Esses limites definem os selos de alerta (saudável, atenção, crítico) mostrados nas fichas técnicas.
      </p>

      {error && <p className="border-rosso text-rosso mt-4 rounded-sm border px-4 py-3 text-sm">{error}</p>}
      {ok && <p className="border-line text-paper mt-4 rounded-sm border px-4 py-3 text-sm">Configuração salva.</p>}

      <form action={updateCmvConfig} className="border-line bg-char mt-6 space-y-4 rounded-sm border p-6">
        <div>
          <label className="text-smoke text-sm">CMV alvo</label>
          <input
            name="cmv_alvo"
            type="number"
            step="0.01"
            min="0"
            max="1"
            required
            defaultValue={config?.cmv_alvo}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">Limite de atenção — abaixo de</label>
          <input
            name="limite_atencao_baixo"
            type="number"
            step="0.01"
            min="0"
            max="1"
            required
            defaultValue={config?.limite_atencao_baixo}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
          <p className="text-smoke mt-1 text-xs">CMV abaixo disso é sinalizado como &quot;abaixo do esperado&quot;.</p>
        </div>
        <div>
          <label className="text-smoke text-sm">Limite saudável — até</label>
          <input
            name="limite_atencao_alto"
            type="number"
            step="0.01"
            min="0"
            max="1"
            required
            defaultValue={config?.limite_atencao_alto}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
        </div>
        <div>
          <label className="text-smoke text-sm">Limite crítico — até</label>
          <input
            name="limite_critico"
            type="number"
            step="0.01"
            min="0"
            max="1"
            required
            defaultValue={config?.limite_critico}
            className="border-line bg-ink text-paper mt-1 w-full rounded-sm border px-3 py-2 outline-none focus:border-rosso"
          />
          <p className="text-smoke mt-1 text-xs">Acima disso, o CMV é sinalizado como crítico.</p>
        </div>

        <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-6 py-2.5 text-base tracking-wide">
          Salvar configuração
        </button>
      </form>
    </div>
  );
}
