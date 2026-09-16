export type CmvConfig = {
  cmv_alvo: number;
  limite_atencao_baixo: number;
  limite_atencao_alto: number;
  limite_critico: number;
};

export type NivelCmv = "abaixo" | "saudavel" | "atencao" | "critico";

export function classificarCmv(cmv: number, config: CmvConfig): NivelCmv {
  if (cmv < config.limite_atencao_baixo) return "abaixo";
  if (cmv <= config.limite_atencao_alto) return "saudavel";
  if (cmv <= config.limite_critico) return "atencao";
  return "critico";
}

export const NIVEL_LABEL: Record<NivelCmv, string> = {
  abaixo: "Abaixo do esperado",
  saudavel: "Saudável",
  atencao: "Atenção",
  critico: "Crítico",
};

export const NIVEL_CLASSES: Record<NivelCmv, string> = {
  abaixo: "text-oro border-oro",
  saudavel: "text-paper border-line",
  atencao: "text-oro border-oro",
  critico: "text-rosso border-rosso",
};

/** CMV real: participação do custo dos insumos sobre o preço de venda do canal. */
export function calcularCmv(custoTotal: number, precoVenda: number) {
  if (!precoVenda) return 0;
  return custoTotal / precoVenda;
}

/** Margem de contribuição normal: preço menos custo de insumos, embalagem e imposto. */
export function margemNormal(
  precoVenda: number,
  custoTotal: number,
  custoEmbalagem: number,
  percImposto: number
) {
  return precoVenda - custoTotal - custoEmbalagem - percImposto * precoVenda;
}

/** Margem de contribuição iFood: inclui também a comissão do canal. */
export function margemIfood(
  precoVenda: number,
  custoTotal: number,
  custoEmbalagem: number,
  percImposto: number,
  percComissaoIfood: number
) {
  return (
    precoVenda - custoTotal - custoEmbalagem - percImposto * precoVenda - percComissaoIfood * precoVenda
  );
}

/** Preço mínimo sugerido para atingir o CMV alvo configurado. */
export function precoSugerido(custoTotal: number, cmvAlvo: number) {
  if (!cmvAlvo) return 0;
  return custoTotal / cmvAlvo;
}
