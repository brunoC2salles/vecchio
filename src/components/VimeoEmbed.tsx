"use client";

import Script from "next/script";

type VimeoEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
  aspectRatio?: string;
};

export function VimeoEmbed({ videoId, title, className, aspectRatio = "75%" }: VimeoEmbedProps) {
  return (
    <div className={className}>
      <div style={{ padding: `${aspectRatio} 0 0 0`, position: "relative" }}>
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          title={title}
        />
      </div>
      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
    </div>
  );
}
