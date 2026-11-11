import { createClient } from "@/lib/supabase/server";
import { TabNav } from "@/components/TabNav";

export default async function ComunidadeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role, is_patrocinador").eq("id", user.id).single()
    : { data: null };

  // Mesma regra da barra lateral: patrocinador (não admin) não vê sala de aula nem material extra.
  const podeVerSalaDeAula = !profile?.is_patrocinador || profile?.role === "admin";

  const tabs = [
    { href: "/dashboard/comunidade/feed", label: "Feed" },
    ...(podeVerSalaDeAula
      ? [
          { href: "/dashboard/comunidade/aulas", label: "Sala de aula" },
          { href: "/dashboard/comunidade/material-extra", label: "Material extra" },
        ]
      : []),
    { href: "/dashboard/comunidade/eventos", label: "Eventos" },
    { href: "/dashboard/comunidade/patrocinadores", label: "Patrocinadores" },
  ];

  return (
    <div>
      <h1 className="font-display text-paper text-3xl md:text-4xl">Comunidade</h1>
      {/* No desktop essas seções ficam na barra lateral; no celular aparecem aqui. */}
      <TabNav tabs={tabs} className="mt-5 md:hidden" />
      <div className="mt-6 w-full max-w-6xl md:mt-8">{children}</div>
    </div>
  );
}
