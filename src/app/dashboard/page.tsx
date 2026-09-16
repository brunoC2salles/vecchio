import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome")
    .eq("id", user!.id)
    .single();

  const primeiroNome = profile?.nome?.split(" ")[0];

  return (
    <div>
      <h1 className="font-display text-paper text-4xl">
        {primeiroNome ? `Bem-vindo, ${primeiroNome}` : "Bem-vindo"}
      </h1>
      <p className="text-smoke mt-3 max-w-lg">
        Esta é a sua área na Vecchio School. A comunidade e a calculadora de CMV
        chegam nas próximas etapas.
      </p>
    </div>
  );
}
