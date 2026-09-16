export type Autor = {
  id: string;
  nome: string;
  avatar_url: string | null;
  is_patrocinador: boolean;
};

export type Comentario = {
  id: string;
  conteudo: string;
  criado_em: string;
  author: Autor | null;
};

export type Post = {
  id: string;
  conteudo: string;
  midia_url: string | null;
  criado_em: string;
  author: Autor | null;
  curtidas: { author_id: string }[];
  comentarios: Comentario[];
};
