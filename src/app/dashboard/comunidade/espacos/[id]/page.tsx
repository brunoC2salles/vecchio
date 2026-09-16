import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchPosts } from "@/components/comunidade/queries";
import { PostComposer } from "@/components/comunidade/PostComposer";
import { PostCard } from "@/components/comunidade/PostCard";

export default async function EspacoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  const { data: espaco } = await supabase.from("espacos").select("id, nome").eq("id", id).single();
  if (!espaco) notFound();

  const posts = await fetchPosts(supabase, id);
  const voltarPara = `/dashboard/comunidade/espacos/${id}`;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-paper text-2xl">{espaco.nome}</h2>

      <PostComposer espacoId={id} voltarPara={voltarPara} error={error} />

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={user!.id}
          isAdmin={profile?.role === "admin"}
          voltarPara={voltarPara}
        />
      ))}

      {posts.length === 0 && (
        <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
          Nenhuma publicação neste espaço ainda.
        </p>
      )}
    </div>
  );
}
