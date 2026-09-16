import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ComunidadeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_patrocinador, role")
    .eq("id", user!.id)
    .single();

  const podeVerSalaDeAula = !profile?.is_patrocinador || profile?.role === "admin";

  const tabs = [
    { href: "/dashboard/comunidade/feed", label: "Feed" },
    { href: "/dashboard/comunidade/espacos", label: "Espaços" },
    ...(podeVerSalaDeAula ? [{ href: "/dashboard/comunidade/aulas", label: "Sala de aula" }] : []),
    { href: "/dashboard/comunidade/eventos", label: "Eventos" },
    { href: "/dashboard/comunidade/patrocinadores", label: "Patrocinadores" },
  ];

  return (
    <div>
      <h1 className="font-display text-paper text-4xl">Comunidade</h1>
      <nav className="border-line mt-6 flex flex-wrap gap-6 border-b pb-3">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className="text-smoke hover:text-paper text-sm">
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 max-w-2xl">{children}</div>
    </div>
  );
}
