export const TOPICOS = [
  { valor: "insumos", label: "Insumos" },
  { valor: "receitas", label: "Receitas" },
  { valor: "metodo", label: "Método" },
  { valor: "eventos", label: "Eventos" },
  { valor: "promocoes", label: "Promoções" },
  { valor: "compras", label: "Compras" },
  { valor: "tema_livre", label: "Tema Livre" },
  { valor: "resultados", label: "Resultados" },
  { valor: "duvidas", label: "Dúvidas" },
] as const;

export type TopicoValor = (typeof TOPICOS)[number]["valor"];

export function labelDoTopico(valor: string) {
  return TOPICOS.find((t) => t.valor === valor)?.label ?? valor;
}
