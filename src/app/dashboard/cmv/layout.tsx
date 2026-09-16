import Link from "next/link";

const tabs = [
  { href: "/dashboard/cmv/insumos", label: "Insumos" },
  { href: "/dashboard/cmv/producoes", label: "Produções internas" },
  { href: "/dashboard/cmv/fichas", label: "Fichas técnicas" },
];

export default function CMVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-paper text-4xl">Calculadora de CMV</h1>
      <nav className="border-line mt-6 flex gap-6 border-b pb-3">
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
