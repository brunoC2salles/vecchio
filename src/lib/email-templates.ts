const WRAPPER_START = `
<div style="background:#0d0b0a;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:480px;margin:0 auto;background:#1a1613;border:1px solid rgba(246,241,230,0.14);border-radius:2px;padding:32px 28px;">
    <p style="color:#c03233;font-size:13px;letter-spacing:0.04em;margin:0 0 4px;">L'ARTE DELLA PIZZA NAPOLETANA</p>
`;
const WRAPPER_END = `
    <p style="color:#b8afa1;font-size:12px;margin-top:32px;">
      Vecchio Napoletana — Rua Silva Jardim 1043, Santa Maria/RS<br/>
      Dúvidas? Responda este e-mail ou chame no Instagram @vecchionapoletana.
    </p>
  </div>
</div>
`;

function botao(href: string, texto: string) {
  return `<a href="${href}" style="display:inline-block;background:#c03233;color:#f6f1e6;text-decoration:none;padding:12px 24px;border-radius:2px;font-weight:bold;margin-top:20px;">${texto}</a>`;
}

export function compraConfirmadaEmail(params: {
  nome: string;
  codigo: string;
  turmaNome: string;
  criarContaUrl: string;
}) {
  const { nome, codigo, turmaNome, criarContaUrl } = params;
  const html = `${WRAPPER_START}
    <h1 style="color:#f6f1e6;font-size:26px;margin:0 0 16px;">Bene, ${nome}! Sua vaga tá garantida.</h1>
    <p style="color:#f6f1e6;font-size:15px;line-height:1.6;">
      Sua inscrição em <strong>${turmaNome}</strong> foi confirmada. Guarde o código abaixo —
      é ele que dá acesso ao curso presencial no dia.
    </p>
    <div style="background:#0d0b0a;border:1px dashed #e5b34d;border-radius:2px;padding:16px;text-align:center;margin:20px 0;">
      <span style="color:#e5b34d;font-size:22px;letter-spacing:0.1em;font-weight:bold;">${codigo}</span>
    </div>
    <p style="color:#f6f1e6;font-size:15px;line-height:1.6;">
      Falta só um passo: criar sua senha de acesso à comunidade Vecchio School, onde você já pode
      trocar ideia com professores, outros alunos e acompanhar as novidades antes do curso.
    </p>
    ${botao(criarContaUrl, "Criar minha senha")}
    <p style="color:#b8afa1;font-size:12px;margin-top:20px;">Se você não fez essa inscrição, pode ignorar este e-mail.</p>
  ${WRAPPER_END}`;

  return { subject: "Sua vaga na Vecchio School está confirmada", html };
}

export function recuperarSenhaEmail(params: { nome: string; resetUrl: string }) {
  const { nome, resetUrl } = params;
  const html = `${WRAPPER_START}
    <h1 style="color:#f6f1e6;font-size:26px;margin:0 0 16px;">Esqueceu a senha, ${nome}?</h1>
    <p style="color:#f6f1e6;font-size:15px;line-height:1.6;">
      Sem problema. Clica no botão abaixo pra escolher uma nova senha de acesso à sua conta
      na Vecchio School.
    </p>
    ${botao(resetUrl, "Definir nova senha")}
    <p style="color:#b8afa1;font-size:12px;margin-top:20px;">
      Se você não pediu essa troca de senha, pode ignorar este e-mail — sua conta continua segura.
    </p>
  ${WRAPPER_END}`;

  return { subject: "Redefinir sua senha — Vecchio School", html };
}
