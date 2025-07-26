import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MatchModalContainer } from "./modals/match";
import { MainLayout } from "./components/MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* MatchModalContainer ficará disponível em todas as páginas */}
        <MatchModalContainer />
        {/* O título pode ser passado via contexto, prop, ou cada página pode definir o seu. */}
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
