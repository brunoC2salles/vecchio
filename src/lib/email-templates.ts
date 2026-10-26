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
      Ao criar a senha, confirme também a data da sua turma presencial.
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

const WRAPPER_END_INTERNO = `
    <p style="color:#b8afa1;font-size:12px;margin-top:32px;">
      Aviso automático da comunidade Vecchio School.
    </p>
  </div>
</div>
`;

function escaparHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function previewTexto(texto: string, limite = 280) {
  const limpo = texto.trim();
  if (limpo.length <= limite) return limpo;
  return limpo.slice(0, limite).trimEnd() + "...";
}

function blocoPreview(texto: string) {
  return `<div style="background:#0d0b0a;border-left:3px solid #e5b34d;border-radius:2px;padding:14px 16px;margin:16px 0;">
      <p style="color:#f6f1e6;font-size:15px;line-height:1.6;margin:0;white-space:pre-wrap;">${escaparHtml(previewTexto(texto))}</p>
    </div>`;
}

function linhaTopicos(topicos: string[]) {
  if (topicos.length === 0) return "";
  const rotulo = topicos.length === 1 ? "Tópico" : "Tópicos";
  return `<p style="color:#b8afa1;font-size:13px;margin:0 0 4px;">${rotulo}: <span style="color:#e5b34d;">${escaparHtml(topicos.join(", "))}</span></p>`;
}

export function novoPostEmail(params: {
  autorNome: string;
  topicos: string[];
  conteudo: string;
  url: string;
}) {
  const { autorNome, topicos, conteudo, url } = params;
  const html = `${WRAPPER_START}
    <h1 style="color:#f6f1e6;font-size:24px;margin:0 0 16px;">Nova publicação no feed</h1>
    <p style="color:#f6f1e6;font-size:15px;margin:0 0 4px;"><strong>${escaparHtml(autorNome)}</strong> publicou:</p>
    ${linhaTopicos(topicos)}
    ${blocoPreview(conteudo)}
    ${botao(url, "Ver post")}
  ${WRAPPER_END_INTERNO}`;

  return { subject: `Nova publicação de ${autorNome} no feed`, html };
}

export function novoComentarioEmail(params: {
  autorNome: string;
  topicos: string[];
  comentario: string;
  postConteudo: string;
  url: string;
}) {
  const { autorNome, topicos, comentario, postConteudo, url } = params;
  const html = `${WRAPPER_START}
    <h1 style="color:#f6f1e6;font-size:24px;margin:0 0 16px;">Novo comentário no feed</h1>
    <p style="color:#f6f1e6;font-size:15px;margin:0 0 4px;"><strong>${escaparHtml(autorNome)}</strong> comentou:</p>
    ${linhaTopicos(topicos)}
    ${blocoPreview(comentario)}
    <p style="color:#b8afa1;font-size:13px;margin:0 0 4px;">Na publicação:</p>
    <p style="color:#b8afa1;font-size:13px;line-height:1.5;margin:0;white-space:pre-wrap;">${escaparHtml(previewTexto(postConteudo, 140))}</p>
    ${botao(url, "Ver post")}
  ${WRAPPER_END_INTERNO}`;

  return { subject: `Novo comentário de ${autorNome} no feed`, html };
}

export function novoLinkAcessoEmail(params: { nome: string; url: string }) {
  const { nome, url } = params;
  const html = `${WRAPPER_START}
    <h1 style="color:#f6f1e6;font-size:26px;margin:0 0 16px;">Olá, ${nome}!</h1>
    <p style="color:#f6f1e6;font-size:15px;line-height:1.6;">
      Identificamos uma falha no link que enviamos para você criar sua senha na comunidade
      Vecchio School. Pedimos desculpas pelo transtorno.
    </p>
    <p style="color:#f6f1e6;font-size:15px;line-height:1.6;">
      O problema já foi corrigido. Use o botão abaixo para criar sua senha e acessar a comunidade.
    </p>
    ${botao(url, "Criar minha senha")}
    <p style="color:#b8afa1;font-size:12px;margin-top:20px;">
      O link é pessoal. Se ele expirar, use "Esqueci minha senha" na página de login.
    </p>
  ${WRAPPER_END}`;

  return { subject: "Seu novo link de acesso à Vecchio School", html };
}
