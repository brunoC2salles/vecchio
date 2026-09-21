import Image from "next/image";

const formados = [
  {
    nome: "João Paulo Vilaverde",
    foto: "/img/prova-social/joao-paulo.jpg",
    depoimento:
      "Fiz o workshop na primeira edição do curso, em 2022. Esse foi o meu primeiro contato com pizza Napoletana e acabei me apaixonando. Hoje, é uma das coisas que eu mais amo fazer, por isso, posso ser suspeito para falar sobre o workshop. Até porque trabalho na Vecchio e sou um dos pizzaiolos daqui da casa, já tem um ano e meio.",
  },
  {
    nome: "Régis Closel",
    foto: "/img/prova-social/regis-closel.jpg",
    depoimento:
      "Participar do workshop sobre pizza napolitana com o pessoal da Vecchio foi sensacional! Aprender com pessoas que admiramos e que têm tanto orgulho e dedicação pelo preparo da pizza faz toda a diferença. Desde o curso, continuo fazendo pizzas em casa e colocando em prática tudo o que aprendi!",
  },
];

export function ProvaSocial() {
  return (
    <section id="depoimentos" className="px-6 py-4 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl text-paper md:text-6xl">Quem já aprendeu com o&nbsp;Vecchio</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {formados.map((f) => (
            <div key={f.nome} className="border-line relative overflow-hidden rounded-sm border">
              <div className="bg-char relative aspect-[4/3] w-full">
                <Image src={f.foto} alt={`Certificado de ${f.nome}`} fill className="object-cover opacity-60" />
              </div>
              <div className="p-6">
                <p className="font-display text-paper text-lg">{f.nome}</p>
                {f.depoimento ? (
                  <p className="text-smoke mt-2 text-sm italic leading-relaxed">“{f.depoimento}”</p>
                ) : (
                  <p className="text-smoke mt-2 text-sm italic">Depoimento a caminho — aguardando texto do aluno.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
