import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAsaasCustomer } from "@/lib/asaas";
import { sendEmail } from "@/lib/email";
import { compraConfirmadaEmail } from "@/lib/email-templates";
import { gerarCodigoAcesso } from "@/lib/codigo-acesso";

// PAYMENT_CONFIRMED cobre cartão (aprovação imediata) e boleto.
// PAYMENT_RECEIVED cobre Pix e dinheiro (não existe CONFIRMED nesse fluxo).
// Escutamos os dois; a idempotência por asaas_payment_id evita duplicar
// quando as duas chegarem para a mesma cobrança (ex: cartão).
const EVENTOS_LIBERACAO = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"];

export async function POST(request: NextRequest) {
  const tokenEsperado = process.env.ASAAS_WEBHOOK_TOKEN;
  const tokenRecebido = request.headers.get("asaas-access-token");

  if (!tokenEsperado || tokenRecebido !== tokenEsperado) {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const body = await request.json();
  const evento = body?.event as string | undefined;
  const payment = body?.payment;

  if (!evento || !payment?.id) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  if (!EVENTOS_LIBERACAO.includes(evento)) {
    return NextResponse.json({ ignored: true });
  }

  const admin = createAdminClient();

  // Idempotência: essa cobrança já foi processada antes?
  const { data: jaProcessado } = await admin
    .from("pagamentos_asaas")
    .select("id")
    .eq("asaas_payment_id", payment.id)
    .maybeSingle();

  if (jaProcessado) {
    return NextResponse.json({ already_processed: true });
  }

  // Identifica a turma pelo link de pagamento que originou a cobrança
  const { data: turma } = payment.paymentLink
    ? await admin
        .from("turmas")
        .select("id, nome")
        .or(
          `asaas_payment_link_id_pix.eq.${payment.paymentLink},asaas_payment_link_id_cartao.eq.${payment.paymentLink}`
        )
        .maybeSingle()
    : { data: null };

  // O webhook só traz o ID do cliente — busca os dados completos na API
  let cliente: Awaited<ReturnType<typeof getAsaasCustomer>> | null = null;
  if (payment.customer) {
    try {
      cliente = await getAsaasCustomer(payment.customer);
    } catch (e) {
      console.error("Falha ao buscar cliente no Asaas:", e);
    }
  }

  const registrarPagamento = (profileId: string | null) =>
    admin.from("pagamentos_asaas").insert({
      asaas_payment_id: payment.id,
      asaas_event_id: body.id ?? null,
      turma_id: turma?.id ?? null,
      profile_id: profileId,
      metodo: payment.billingType,
      valor: payment.value,
      evento,
      status_pagamento: payment.status,
      customer_asaas_id: payment.customer ?? null,
      nome_cliente: cliente?.name ?? null,
      email_cliente: cliente?.email ?? null,
      cpf_cliente: cliente?.cpfCnpj ?? null,
      payload: body,
    });

  // Sem turma mapeada ou sem e-mail do cliente: registra pra auditoria manual e para por aqui.
  // Retorna 200 de propósito — um erro aqui faria o Asaas ficar re-tentando e pode pausar a fila.
  if (!turma || !cliente?.email) {
    await registrarPagamento(null);
    return NextResponse.json({
      warning: "turma ou cliente não identificado — verifique a tabela pagamentos_asaas",
    });
  }

  const email = cliente.email;
  const nome = cliente.name;
  const telefone = cliente.mobilePhone ?? cliente.phone ?? null;

  const { data: perfilExistente } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  let profileId = perfilExistente?.id ?? null;

  if (!profileId) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vecchioschool.com.br";
    const { data: linked, error } = await admin.auth.admin.generateLink({
      type: "invite",
      email,
      options: { redirectTo: `${siteUrl}/auth/callback?next=/set-password` },
    });

    if (error || !linked?.user) {
      console.error("Falha ao criar conta a partir do webhook Asaas:", error);
      await registrarPagamento(null);
      return NextResponse.json({ error: "falha ao criar conta" }, { status: 500 });
    }

    profileId = linked.user.id;
    await admin.from("profiles").update({ nome, telefone }).eq("id", profileId);

    const codigo = gerarCodigoAcesso();
    await admin.from("matriculas").insert({
      profile_id: profileId,
      turma_id: turma.id,
      status: "pago",
      codigo_acesso_presencial: codigo,
    });

    const { subject, html } = compraConfirmadaEmail({
      nome,
      codigo,
      turmaNome: turma.nome,
      criarContaUrl: linked.properties.action_link,
    });

    await sendEmail({ to: email, subject, html });
  } else {
    // Conta já existe (ex: 2ª parcela do cartão chegando, ou compra repetida) —
    // garante que a matrícula desta turma existe e está paga, sem recriar nada.
    const { data: matriculaExistente } = await admin
      .from("matriculas")
      .select("id, status")
      .eq("profile_id", profileId)
      .eq("turma_id", turma.id)
      .maybeSingle();

    if (!matriculaExistente) {
      await admin.from("matriculas").insert({
        profile_id: profileId,
        turma_id: turma.id,
        status: "pago",
        codigo_acesso_presencial: gerarCodigoAcesso(),
      });
    } else if (matriculaExistente.status !== "pago") {
      await admin.from("matriculas").update({ status: "pago" }).eq("id", matriculaExistente.id);
    }
  }

  await registrarPagamento(profileId);

  return NextResponse.json({ received: true });
}
