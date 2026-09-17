const ASAAS_BASE_URL = "https://api.asaas.com/v3";

function getApiKey() {
  const key = process.env.ASAAS_API_KEY;
  if (!key) {
    throw new Error("ASAAS_API_KEY não configurada.");
  }
  return key;
}

async function asaasFetch(path: string) {
  const res = await fetch(`${ASAAS_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "VecchioSchool/1.0",
      access_token: getApiKey(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Asaas API erro (${res.status}) em ${path}: ${body}`);
  }

  return res.json();
}

export type AsaasCustomer = {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string | null;
  phone: string | null;
  mobilePhone: string | null;
};

/**
 * O payload do webhook de pagamento só traz o ID do cliente ("customer": "cus_xxx"),
 * não os dados completos. Por isso é preciso consultar a API pra pegar nome/e-mail/CPF.
 */
export async function getAsaasCustomer(customerId: string): Promise<AsaasCustomer> {
  return asaasFetch(`/customers/${customerId}`);
}

export type AsaasPaymentLink = {
  id: string;
  name: string;
  url: string;
  active: boolean;
  billingType: string;
  value: number | null;
};

export async function listAsaasPaymentLinks(): Promise<AsaasPaymentLink[]> {
  const result = await asaasFetch(`/paymentLinks?limit=100`);
  return result.data ?? [];
}
