import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TabNav } from "@/components/TabNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const tabs = [
    { href: "/dashboard/admin/membros", label: "Membros" },
    { href: "/dashboard/admin/novo-aluno", label: "Novo aluno" },
    { href: "/dashboard/admin/turmas", label: "Turmas" },
    { href: "/dashboard/admin/config", label: "Configuração de CMV" },
  ];

  return (
    <div>
      <h1 className="font-display text-paper text-3xl md:text-4xl">Administração</h1>
      <TabNav tabs={tabs} className="mt-5 md:mt-6" />
      <div className="mt-6 md:mt-8">{children}</div>
    </div>
  );
}
