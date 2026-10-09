export type TipoLinkAuth = "invite" | "recovery";

// Link do e-mail aponta para uma página nossa com botão de confirmação.
// O token só é validado quando a pessoa aperta o botão (POST), então leitores
// de e-mail que abrem links automaticamente (Apple Mail, Gmail) não o gastam.
// `criarSenha` só muda o texto da página (link de recuperação usado para o primeiro acesso).
export function linkConfirmacaoAuth(hashedToken: string, tipo: TipoLinkAuth, criarSenha = false) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vecchioschool.com.br";
  const params = new URLSearchParams({ token_hash: hashedToken, type: tipo });
  if (criarSenha) params.set("acao", "criar");
  return `${siteUrl}/auth/confirmar?${params.toString()}`;
}
