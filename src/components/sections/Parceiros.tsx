import Image from "next/image";

const comLogo = [
  { nome: "Le5Stagioni", logo: "/img/partners/le5stagioni.png", link: "https://www.instagram.com/le5stagionisp/" },
  { nome: "Egil", logo: "/img/partners/egil.png", link: "https://www.instagram.com/egil.oficial/" },
  { nome: "Sauce & Co.", logo: "/img/partners/sauce.png", link: "https://www.instagram.com/sauce.and.co/" },
  { nome: "FornoSanto", logo: "/img/partners/fornosanto.png", link: "https://www.instagram.com/fornosanto/" },
  { nome: "LAB Confecções", logo: "/img/partners/lab.png", link: "https://www.instagram.com/labconfeccoes/" },
  { nome: "Bonfiore Latteria", logo: "/img/partners/bonfiore.png", link: "" }, // TODO: colocar o link do Instagram/site da Bonfiore
  { nome: "C-Trade Gourmet", logo: "/img/partners/ctrade.png", link: "https://www.instagram.com/ctradegourmet" },
  { nome: "Ciao", logo: "/img/partners/ciao.png", link: "https://www.instagram.com/ciaoilpomodorodinapoli/" },
];

export function Parceiros() {
  return (
    <section id="parceiros" className="px-6 py-4 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-paper text-center text-4xl md:text-6xl">PARCEIROS DO VECCHIO</h2>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
          {comLogo.map((p) => (
            <a
              key={p.nome}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-20 items-center justify-center opacity-80 transition-opacity hover:opacity-100 md:h-24"
              aria-label={p.nome}
            >
              <Image src={p.logo} alt={p.nome} width={160} height={96} className="h-full w-auto object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
