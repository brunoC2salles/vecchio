import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bodyFont = localFont({
  src: "../fonts/Bitter.ttf",
  variable: "--font-body",
  display: "swap",
});

const displayFont = localFont({
  src: "../fonts/Bogart-Bold.woff2",
  variable: "--font-display",
  weight: "700",
  display: "swap",
});

const title = "Vecchio School — L'arte della pizza napoletana";
const description =
  "Curso presencial de Verace Pizza Napoletana com o chef pizzaiolo Lucas Molz Lara, da Vecchio Napoletana, pizzaria certificada AVPN em Santa Maria/RS.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vecchioschool.com.br"),
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
