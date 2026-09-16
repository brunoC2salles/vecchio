import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";

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

  return (
    <div className="flex min-h-screen">
      <Sidebar
        nome={profile?.nome ?? user.email ?? ""}
        role={profile?.role ?? "aluno"}
        isPatrocinador={profile?.is_patrocinador ?? false}
        isAdmin={profile?.role === "admin"}
      />

      <main className="flex-1 px-8 py-10 md:px-12">{children}</main>
    </div>
  );
}
