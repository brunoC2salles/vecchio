import { toEmbedUrl } from "./embed";
import { buscarPrevia } from "./linkPreview";

export async function LinkPreviewCard({ url }: { url: string }) {
  const embedUrl = toEmbedUrl(url);
  if (embedUrl) {
    return (
      <div className="mt-3 aspect-video w-full overflow-hidden rounded-sm">
        <iframe src={embedUrl} title="Vídeo" allowFullScreen loading="lazy" className="h-full w-full border-0" />
      </div>
    );
  }

  const previa = await buscarPrevia(url);
  if (!previa) return null;

  return (
    <a
      href={previa.url}
      target="_blank"
      rel="noopener noreferrer nofollow ugc"
      className="border-line bg-ink hover:border-oro mt-3 block overflow-hidden rounded-sm border transition-colors"
    >
      {previa.imagem && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previa.imagem}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="aspect-[1.91/1] w-full object-cover"
        />
      )}
      <div className="space-y-1 px-3 py-2.5">
        <p className="text-smoke text-xs uppercase tracking-wide">{previa.dominio}</p>
        <p className="text-paper line-clamp-2 text-sm font-semibold leading-snug">{previa.titulo}</p>
        {previa.descricao && <p className="text-smoke line-clamp-2 text-xs leading-relaxed">{previa.descricao}</p>}
      </div>
    </a>
  );
}
