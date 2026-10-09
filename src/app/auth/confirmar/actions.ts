"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const LINK_INVALIDO =
  "Este link já foi usado ou expirou. Informe seu e-mail para receber um novo link e criar sua senha.";

export async function confirmarLink(formData: FormData) {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const tipo = String(formData.get("type") ?? "");

  if (!tokenHash || (tipo !== "invite" && tipo !== "recovery")) {
    redirect("/esqueci-senha?error=" + encodeURIComponent(LINK_INVALIDO));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo });

  if (error) {
    redirect("/esqueci-senha?error=" + encodeURIComponent(LINK_INVALIDO));
  }

  redirect("/set-password");
}
