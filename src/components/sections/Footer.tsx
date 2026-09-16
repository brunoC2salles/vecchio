import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

export function Footer() {
  return (
    <footer id="contato" className="px-6 pb-8 pt-6 md:px-12">

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Image src="/img/logo.png" alt="Vecchio School" width={56} height={56} className="h-12 w-auto" />
            <p className="font-display text-paper mt-3 text-lg">Vecchio Napoletana</p>
          </div>

          <address className="text-smoke text-sm not-italic leading-relaxed">
            Rua Silva Jardim 1043
            <br />
            CEP 97010-491 — Santa Maria/RS
            <br />
            Telefone: 55 999211984
            <br />
            Ter&ccedil;a a sexta, das 16h &agrave;s 20h
          </address>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <CTAButton href="/matricula" className="px-5 py-2 text-sm">
              Garantir minha vaga
            </CTAButton>
            <p className="text-smoke text-xs">contato@vecchioschool.com.br</p>
          </div>
        </div>

        <p className="text-smoke mt-8 text-center text-xs">
          CNPJ 41.449.090/0001-80 &middot; Inscri&ccedil;&atilde;o Estadual 109/0411526
        </p>
      </div>
    </footer>
  );
}
