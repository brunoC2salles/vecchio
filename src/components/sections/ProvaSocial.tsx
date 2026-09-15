import Image from "next/image";

const formados = [
  { nome: "João Paulo Vilaverde", foto: "/img/prova-social/joao-paulo.jpg" },
  { nome: "Luciana Soares", foto: "/img/prova-social/luciana.jpg" },
];

export function ProvaSocial() {
  return (
    <section id="depoimentos" className="px-6 py-4 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl text-paper md:text-6xl">Quem já passou pelo forno</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {formados.map((f) => (
            <div key={f.nome} className="border-line relative overflow-hidden rounded-sm border">
              <div className="bg-char relative aspect-[4/3] w-full">
                <Image src={f.foto} alt={`Certificado de ${f.nome}`} fill className="object-cover opacity-60" />
              </div>
              <div className="p-6">
                <p className="font-display text-paper text-lg">{f.nome}</p>
                <p className="text-smoke mt-2 text-sm italic">Depoimento a caminho — aguardando texto do aluno.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
