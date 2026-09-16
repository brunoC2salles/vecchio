import type { SupabaseClient } from "@supabase/supabase-js";
import type { Post } from "./types";

export async function fetchPosts(
  supabase: SupabaseClient,
  espacoId: string | null
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select(
      `
      id, conteudo, midia_url, criado_em,
      author:profiles!posts_author_id_fkey ( id, nome, avatar_url, is_patrocinador ),
      curtidas ( author_id ),
      comentarios ( id, conteudo, criado_em, author:profiles!comentarios_author_id_fkey ( id, nome, avatar_url, is_patrocinador ) )
    `
    )
    .order("criado_em", { ascending: false });

  query = espacoId === null ? query.is("espaco_id", null) : query.eq("espaco_id", espacoId);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as unknown as Post[];
}
