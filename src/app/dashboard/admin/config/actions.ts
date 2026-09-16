"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateCmvConfig(formData: FormData) {
  const supabase = await createClient();

  const cmvAlvo = Number(formData.get("cmv_alvo"));
  const limiteAtencaoBaixo = Number(formData.get("limite_atencao_baixo"));
  const limiteAtencaoAlto = Number(formData.get("limite_atencao_alto"));
  const limiteCritico = Number(formData.get("limite_critico"));

  const { error } = await supabase
    .from("cmv_config")
    .update({
      cmv_alvo: cmvAlvo,
      limite_atencao_baixo: limiteAtencaoBaixo,
      limite_atencao_alto: limiteAtencaoAlto,
      limite_critico: limiteCritico,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) {
    redirect("/dashboard/admin/config?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard/admin/config?ok=1");
}
