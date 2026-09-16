import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

export function Footer() {
  return (
    <footer id="contato" className="px-6 pb-12 pt-6 md:px-12">
      <div className="border-line mx-auto max-w-6xl border-t pt-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Image src="/img/logo.png" alt="Vecchio School" width={72} height={72} className="h-12 w-auto" />
            <p className="font-display text-paper mt-4 text-xl">Vecchio Napoletana</p>
            <address className="text-smoke mt-2 max-w-xs text-sm not-italic leading-relaxed">
              Rua Silva Jardim 1043 — CEP 97010-491 — Santa Maria/RS
              <br />
              Telefone: 55 999211984
              <br />
              Atendimento: terça a sexta, das 16h às 20h
              <br />
              contato@vecchioschool.com.br
            </address>
            <p className="text-smoke mt-4 text-xs">
              CNPJ 41.449.090/0001-80 · Inscrição Estadual 109/0411526
            </p>
          </div>

          <CTAButton href="/matricula">Garantir minha vaga</CTAButton>
        </div>
      </div>
    </footer>
  );
}
