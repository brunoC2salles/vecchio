import clsx from "clsx";
import type { TurmaData } from "@/lib/turma-datas";

// Lista de datas em formato de opção (radio), usada na criação de senha
// e na página de confirmação de data. Funciona sem JavaScript.
export function EscolhaDataTurma({
  datas,
  preSelecionada,
  name = "turma_data_id",
}: {
  datas: TurmaData[];
  preSelecionada?: string | null;
  name?: string;
}) {
  const padrao =
    datas.find((d) => d.id === preSelecionada && !d.lotada)?.id ?? null;

  return (
    <fieldset className="space-y-3">
      <legend className="text-smoke text-sm">Data da sua turma presencial</legend>
      <div className="mt-2 grid gap-3">
        {datas.map((d) => (
          <label
            key={d.id}
            className={clsx(
              "border-line bg-char flex items-center gap-3 rounded-sm border px-4 py-3",
              d.lotada ? "cursor-not-allowed opacity-50" : "cursor-pointer has-[:checked]:border-oro!"
            )}
          >
            <input
              type="radio"
              name={name}
              value={d.id}
              required
              disabled={d.lotada}
              defaultChecked={d.id === padrao}
              className="accent-oro"
            />
            <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-paper">{d.rotulo}</span>
              <span className="text-smoke text-xs">
                {d.lotada ? "lotada" : `${d.restantes} ${d.restantes === 1 ? "vaga" : "vagas"}`}
              </span>
            </span>
          </label>
        ))}
      </div>
      <p className="text-smoke text-xs">Depois de confirmada, a troca de data só pode ser feita pela equipe.</p>
    </fieldset>
  );
}
