import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { buscarMatriculaPendente } from "@/lib/turma-datas";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, role, is_patrocinador")
    .eq("id", user.id)
    .single();

  // Aluno com matrícula sem data escolhida precisa confirmar a turma antes de seguir.
  if (profile?.role !== "admin" && (await buscarMatriculaPendente(user.id))) {
    redirect("/escolher-data");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        nome={profile?.nome ?? user.email ?? ""}
        role={profile?.role ?? "aluno"}
        isPatrocinador={profile?.is_patrocinador ?? false}
        isAdmin={profile?.role === "admin"}
      />

      <main className="min-w-0 flex-1 px-4 pt-6 pb-28 md:px-12 md:py-10">{children}</main>

      <MobileNav isAdmin={profile?.role === "admin"} />
    </div>
  );
}
