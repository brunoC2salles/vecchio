import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pepperoni = localFont({
  src: "../fonts/PepperoniPizza.ttf",
  variable: "--font-display",
  display: "swap",
});

const bodyFont = localFont({
  src: "../fonts/LibreBaskerville.ttf",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vecchio School — L'arte della pizza napoletana",
  description:
    "Curso presencial de Verace Pizza Napoletana com o chef pizzaiolo Lucas Molz Lara, da Vecchio Napoletana, pizzaria certificada AVPN em Santa Maria/RS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${pepperoni.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
