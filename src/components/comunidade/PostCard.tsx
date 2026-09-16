import type { Post } from "./types";
import { addComment, deletePost, toggleLike } from "./actions";

type PostCardProps = {
  post: Post;
  currentUserId: string;
  isAdmin: boolean;
  voltarPara: string;
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostCard({ post, currentUserId, isAdmin, voltarPara }: PostCardProps) {
  const curtiu = post.curtidas.some((c) => c.author_id === currentUserId);
  const podeExcluir = post.author?.id === currentUserId || isAdmin;

  return (
    <div className="border-line bg-char rounded-sm border p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-paper text-sm font-semibold">
            {post.author?.nome ?? "Aluno"}
            {post.author?.is_patrocinador && <span className="text-oro ml-2 text-xs">patrocinador</span>}
          </p>
          <p className="text-smoke text-xs">{formatarData(post.criado_em)}</p>
        </div>
        {podeExcluir && (
          <form action={deletePost.bind(null, post.id, voltarPara)}>
            <button type="submit" className="text-rosso text-xs underline underline-offset-2">
              excluir
            </button>
          </form>
        )}
      </div>

      <p className="text-paper mt-3 whitespace-pre-wrap text-sm leading-relaxed">{post.conteudo}</p>

      {post.midia_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.midia_url} alt="" className="mt-3 max-h-96 w-full rounded-sm object-cover" />
      )}

      <div className="border-line mt-4 flex items-center gap-4 border-t pt-3">
        <form action={toggleLike.bind(null, post.id, voltarPara)}>
          <button type="submit" className={curtiu ? "text-rosso text-sm" : "text-smoke hover:text-paper text-sm"}>
            ♥ {post.curtidas.length}
          </button>
        </form>
        <span className="text-smoke text-sm">{post.comentarios.length} comentário{post.comentarios.length === 1 ? "" : "s"}</span>
      </div>

      {post.comentarios.length > 0 && (
        <div className="border-line mt-3 space-y-2 border-t pt-3">
          {post.comentarios.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="text-paper font-semibold">{c.author?.nome ?? "Aluno"}: </span>
              <span className="text-smoke">{c.conteudo}</span>
            </div>
          ))}
        </div>
      )}

      <form action={addComment} className="mt-3 flex gap-2">
        <input type="hidden" name="post_id" value={post.id} />
        <input type="hidden" name="voltar_para" value={voltarPara} />
        <input
          name="conteudo"
          placeholder="Escreva um comentário..."
          className="border-line bg-ink text-paper flex-1 rounded-sm border px-3 py-1.5 text-sm outline-none focus:border-rosso"
        />
        <button type="submit" className="text-oro text-sm">
          Enviar
        </button>
      </form>
    </div>
  );
}
