type AvatarProps = {
  nome: string | null | undefined;
  url: string | null | undefined;
  tamanho?: "sm" | "md";
};

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "A";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export function Avatar({ nome, url, tamanho = "md" }: AvatarProps) {
  const classeTamanho = tamanho === "sm" ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-sm";

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className={`${classeTamanho} shrink-0 rounded-full object-cover`} />
    );
  }

  return (
    <span
      aria-hidden
      className={`${classeTamanho} border-line bg-ink text-oro flex shrink-0 items-center justify-center rounded-full border font-semibold`}
    >
      {iniciais(nome ?? "Aluno")}
    </span>
  );
}
