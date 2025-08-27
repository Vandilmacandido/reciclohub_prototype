import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MatchModalContainer } from "./modals/match";
import ConditionalLayout from "./components/ConditionalLayout";
import OrientationController from "./components/OrientationController";

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
  other: {
    'screen-orientation': 'portrait',
    'orientation': 'portrait',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="screen-orientation" content="portrait" />
        <meta name="orientation" content="portrait" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-orientation" content="portrait" />
        <meta name="msapplication-orientation" content="portrait" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <OrientationController />
        {/* MatchModalContainer ficará disponível em todas as páginas */}
        <MatchModalContainer />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
