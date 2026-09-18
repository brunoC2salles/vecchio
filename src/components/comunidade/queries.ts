import type { SupabaseClient } from "@supabase/supabase-js";
import type { Post } from "./types";

export async function fetchPosts(supabase: SupabaseClient, topico?: string | null): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select(
      `
      id, conteudo, midia_url, criado_em, topicos,
      author:profiles!posts_author_id_fkey ( id, nome, avatar_url, is_patrocinador ),
      curtidas ( author_id ),
      comentarios ( id, conteudo, criado_em, author:profiles!comentarios_author_id_fkey ( id, nome, avatar_url, is_patrocinador ) )
    `
    )
    .order("criado_em", { ascending: false });

  if (topico) {
    query = query.contains("topicos", [topico]);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as unknown as Post[];
}
