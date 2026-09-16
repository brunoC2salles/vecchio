import { createClient } from "@/lib/supabase/server";
import { fetchPosts } from "@/components/comunidade/queries";
import { PostComposer } from "@/components/comunidade/PostComposer";
import { PostCard } from "@/components/comunidade/PostCard";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  const posts = await fetchPosts(supabase, null);
  const voltarPara = "/dashboard/comunidade/feed";

  return (
    <div className="space-y-6">
      <PostComposer espacoId={null} voltarPara={voltarPara} error={error} />

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
          Nenhuma publicação ainda. Seja o primeiro a compartilhar algo.
        </p>
      )}
    </div>
  );
}
