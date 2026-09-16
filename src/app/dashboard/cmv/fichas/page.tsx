import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteFicha } from "./actions";
import {
  calcularCmv,
  classificarCmv,
  margemIfood,
  margemNormal,
  NIVEL_CLASSES,
  NIVEL_LABEL,
  precoSugerido,
  type CmvConfig,
} from "@/components/cmv/calculations";

export default async function FichasPage() {
  const supabase = await createClient();

  const [{ data: fichas }, { data: config }] = await Promise.all([
    supabase
      .from("fichas_tecnicas")
      .select(
        "id, nome, custo_total, preco_venda_normal, preco_venda_ifood, custo_embalagem, perc_imposto, perc_comissao_ifood"
      )
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
      <div className="flex items-center justify-between">
        <p className="text-smoke max-w-md text-sm">
          CMV real = custo dos insumos ÷ preço de venda. Margem de contribuição desconta também
          embalagem, imposto e, no iFood, a comissão do canal.
        </p>
        <Link
          href="/dashboard/cmv/fichas/novo"
          className="font-display bg-rosso text-paper flex-shrink-0 rounded-sm px-5 py-2 text-sm tracking-wide"
        >
          Nova ficha
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {(fichas ?? []).map((f) => {
          const cmvNormal = calcularCmv(Number(f.custo_total), Number(f.preco_venda_normal));
          const nivelNormal = classificarCmv(cmvNormal, cfg);
          const mNormal = margemNormal(
            Number(f.preco_venda_normal),
            Number(f.custo_total),
            Number(f.custo_embalagem),
            Number(f.perc_imposto)
          );

          const temIfood = Number(f.preco_venda_ifood) > 0;
          const cmvIfood = temIfood ? calcularCmv(Number(f.custo_total), Number(f.preco_venda_ifood)) : null;
          const nivelIfood = cmvIfood !== null ? classificarCmv(cmvIfood, cfg) : null;
          const mIfood = temIfood
            ? margemIfood(
                Number(f.preco_venda_ifood),
                Number(f.custo_total),
                Number(f.custo_embalagem),
                Number(f.perc_imposto),
                Number(f.perc_comissao_ifood)
              )
            : null;

          const sugerido = precoSugerido(Number(f.custo_total), cfg.cmv_alvo);

          return (
            <div key={f.id} className="border-line bg-char rounded-sm border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-paper text-xl">{f.nome}</p>
                  <p className="text-smoke mt-1 text-xs">
                    Custo dos insumos: R$ {Number(f.custo_total).toFixed(2)} · Preço sugerido (CMV alvo{" "}
                    {(cfg.cmv_alvo * 100).toFixed(0)}%): R$ {sugerido.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/dashboard/cmv/fichas/${f.id}`} className="text-smoke hover:text-paper text-xs underline underline-offset-2">
                    editar
                  </Link>
                  <form action={deleteFicha.bind(null, f.id)}>
                    <button type="submit" className="text-rosso text-xs underline underline-offset-2">
                      excluir
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className={`rounded-sm border p-3 ${NIVEL_CLASSES[nivelNormal]}`}>
                  <p className="text-paper text-sm font-semibold">Canal normal</p>
                  <p className="text-paper mt-1 text-lg">CMV: {(cmvNormal * 100).toFixed(1)}%</p>
                  <p className="text-smoke text-sm">Margem de contribuição: R$ {mNormal.toFixed(2)}</p>
                  <p className="mt-1 text-xs">{NIVEL_LABEL[nivelNormal]}</p>
                </div>

                {temIfood && nivelIfood && (
                  <div className={`rounded-sm border p-3 ${NIVEL_CLASSES[nivelIfood]}`}>
                    <p className="text-paper text-sm font-semibold">iFood</p>
                    <p className="text-paper mt-1 text-lg">CMV: {(cmvIfood! * 100).toFixed(1)}%</p>
                    <p className="text-smoke text-sm">Margem de contribuição: R$ {mIfood!.toFixed(2)}</p>
                    <p className="mt-1 text-xs">{NIVEL_LABEL[nivelIfood]}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {(fichas ?? []).length === 0 && (
          <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
            Nenhuma ficha técnica cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
