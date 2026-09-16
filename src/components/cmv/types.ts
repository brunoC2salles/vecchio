export type Insumo = {
  id: string;
  nome: string;
  categoria: string | null;
  tipo: "base" | "producao_interna";
  unidade: string;
  preco_compra: number;
  rendimento: number;
  custo_unitario: number;
};

export type ItemLinha = {
  insumo_id: string;
  quantidade: number;
};
