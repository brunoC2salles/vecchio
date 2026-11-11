import { TabNav } from "@/components/TabNav";

const tabs = [
  { href: "/dashboard/cmv/insumos", label: "Insumos" },
  { href: "/dashboard/cmv/producoes", label: "Produções internas" },
  { href: "/dashboard/cmv/fichas", label: "Fichas técnicas" },
];

export default function CMVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-paper text-3xl md:text-4xl">Calculadora de CMV</h1>
      <TabNav tabs={tabs} className="mt-5 md:mt-6" />
      <div className="mt-6 md:mt-8">{children}</div>
    </div>
  );
}
