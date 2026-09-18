import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchPosts } from "@/components/comunidade/queries";
import { PostComposer } from "@/components/comunidade/PostComposer";
import { PostCard } from "@/components/comunidade/PostCard";
import { TOPICOS } from "@/components/comunidade/topicos";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; topico?: string }>;
}) {
  const { error, topico } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  const posts = await fetchPosts(supabase, topico ?? null);
  const voltarPara = topico ? `/dashboard/comunidade/feed?topico=${topico}` : "/dashboard/comunidade/feed";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/comunidade/feed"
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors ${
            !topico ? "bg-rosso text-paper" : "border-rosso text-rosso border"
          }`}
        >
          Todos
        </Link>
        {TOPICOS.map((t) => (
          <Link
            key={t.valor}
            href={`/dashboard/comunidade/feed?topico=${t.valor}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors ${
              topico === t.valor ? "bg-rosso text-paper" : "border-rosso text-rosso border"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <PostComposer voltarPara={voltarPara} error={error} />

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
          {topico ? "Nenhuma publicação nesse tópico ainda." : "Nenhuma publicação ainda. Seja o primeiro a compartilhar algo."}
        </p>
      )}
    </div>
  );
}
