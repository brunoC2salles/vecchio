import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
      <h1 className="font-display text-paper text-4xl">Administração</h1>
      <nav className="border-line mt-6 flex flex-wrap gap-6 border-b pb-3">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className="text-smoke hover:text-paper text-sm">
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
