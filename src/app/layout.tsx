import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MatchModalContainer } from "./modals/match";
import ConditionalLayout from "./components/ConditionalLayout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "RecicloHub",
  description: "Plataforma de Conexão para Reciclagem Sustentável",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} antialiased`}>
        {/* MatchModalContainer ficará disponível em todas as páginas */}
        <MatchModalContainer />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
