import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

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
      <aside className="border-line bg-char flex w-64 flex-shrink-0 flex-col border-r px-6 py-8">
        <Link href="/dashboard" className="block">
          <Image src="/img/logo.png" alt="Vecchio School" width={64} height={64} className="h-10 w-auto" />
        </Link>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          <Link
            href="/dashboard"
            className="text-paper hover:bg-ink rounded-sm px-3 py-2.5 text-sm transition-colors"
          >
            Início
          </Link>
          <span className="text-smoke cursor-not-allowed rounded-sm px-3 py-2.5 text-sm">
            Comunidade — em breve
          </span>
          <span className="text-smoke cursor-not-allowed rounded-sm px-3 py-2.5 text-sm">
            Calculadora de CMV — em breve
          </span>
          {profile?.role === "admin" && (
            <span className="text-smoke cursor-not-allowed rounded-sm px-3 py-2.5 text-sm">
              Administração — em breve
            </span>
          )}
        </nav>

        <div className="border-line border-t pt-4">
          <p className="text-paper text-sm">{profile?.nome ?? user.email}</p>
          <p className="text-smoke text-xs capitalize">
            {profile?.role}
            {profile?.is_patrocinador ? " · patrocinador" : ""}
          </p>
          <form action={signOut} className="mt-3">
            <button type="submit" className="text-smoke text-xs underline underline-offset-2">
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-8 py-10 md:px-12">{children}</main>
    </div>
  );
}
