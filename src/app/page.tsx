"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Verifica se o usuário está logado ao carregar a página
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/feed");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-white" id="">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/RECICLOHUB_Green.png" alt="RecicloHub" width={150} height={40} className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#benefits" className="text-gray-600 hover:text-teal-600 text-sm md:text-base">
              Benefícios
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-teal-600 text-sm md:text-base">
              Como Funciona
            </Link>
            <Link href="#mission" className="text-gray-600 hover:text-teal-600 text-sm md:text-base">
              Sobre Nós
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[#00A2AA] px-4 py-2 text-sm md:text-base font-medium text-white hover:bg-teal-600"
            >
              Cadastre-se
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-[#00A2AA] px-4 py-2 text-sm md:text-base font-medium text-white hover:bg-teal-600"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center rounded-md bg-[#00A2AA] p-2 text-white hover:bg-teal-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="absolute top-0 left-0 w-full h-full bg-white">
              <div className="flex justify-end p-4">
                <button
                  className="text-gray-600 hover:text-teal-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col items-center space-y-6 mt-10">
                <Link
                  href="#benefits"
                  className="text-gray-600 hover:text-teal-600 text-lg font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Benefícios
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-600 hover:text-teal-600 text-lg font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                <Link
                  href="#mission"
                  className="text-gray-600 hover:text-teal-600 text-lg font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sobre Nós
                </Link>
                <Link
                  href="#cadastro"
                  className="rounded-md bg-[#00A2AA] px-6 py-3 text-white font-medium hover:bg-teal-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Cadastre-se
                </Link>
                <Link
                  href="/login"
                  className="rounded-md bg-[#00A2AA] px-6 py-3 text-white font-medium hover:bg-teal-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-[#83D5D9]/15 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-3xl md:text-5xl font-extrabold text-[#00757B] leading-tight">
            Conectando Indústrias,
            <br />
            Transformando Resíduos em
            <br />
            Oportunidades
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-sm md:text-lg text-gray-600 leading-relaxed">
            Uma plataforma digital para troca, venda e doação de resíduos industriais entre empresas, promovendo a
            simbiose industrial e impulsionando a economia circular no Brasil.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <Link
              href="#cadastro"
              className="rounded-full bg-[#00A2AA] px-6 py-3 text-sm font-bold md:text-base text-white hover:bg-teal-600"
            >
              Cadastre sua empresa
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border border-[#00A2AA] bg-white px-6 py-3 text-sm md:text-base text-[#00A2AA] hover:bg-teal-50"
            >
              Saiba como funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="mb-12 text-center text-3xl md:text-4xl font-extrabold text-[#00A2AA]">Por que usar nossa plataforma?</h1>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-lg bg-[#00A2AA] p-8 text-left border border-gray-200 text-white transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2">
              <h3 className="mb-4 text-xl font-bold ">Ganhos Econômicos</h3>
              <p className="text-base font-medium leading-relaxed">
                Reduza seus custos operacionais ao diminuir significativamente as despesas com o descarte de resíduos. Além disso, transforme o que antes era um problema em uma nova fonte de receita através da reutilização ou venda inteligente de materiais valorizáveis.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg bg-[#00A2AA] p-8 text-left border border-gray-200 text-white transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2">
              <h3 className="mb-4 text-xl font-bold">Sustentabilidade Prática</h3>
              <p className="text-base font-medium leading-relaxed">
                Contribua ativamente para um futuro mais verde ao reduzir o volume de resíduos destinados a aterros sanitários e diminuir a emissão de gases como o CO2 em suas operações. Demonstre seu compromisso ambiental e fortaleça a reputação da sua empresa junto a clientes e investidores.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg bg-[#00A2AA] p-8 text-left border border-gray-200 text-white transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2">
              <h3 className="mb-4 text-xl font-bold">Conexões Inteligentes</h3>
              <p className="text-base font-medium leading-relaxed">
                Amplie sua rede de contatos com empresas que possuem interesse nos seus resíduos ou que podem fornecer os materiais que você necessita. Estabeleça relações comerciais mutuamente benéficas e sustentáveis, impulsionando a economia circular em sua cadeia de valor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-[#83D5D9]/15 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl md:text-4xl font-black text-[#00A2AA]">Como Funciona?</h2>
          <div className="grid gap-12 md:grid-cols-2">
            {/* Card 1 */}
            <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md">
              <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white">
                1
              </div>
              <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Cadastre sua empresa</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Dedique alguns minutos para registrar sua empresa em nossa plataforma. Informe detalhes cruciais como o setor de atuação, a localização geográfica e os tipos de materiais (resíduos ou matérias-primas) com os quais você trabalha ou tem interesse. Ao fornecer informações precisas, você aumenta suas chances de ser encontrado por parceiros relevantes e de descobrir oportunidades que realmente se encaixam no seu negócio.
              </p>
            </div>

            {/* Card 2 */}
            <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md">
              <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white">
                2
              </div>
              <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Ofereça ou busque resíduos</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Utilize nossa interface intuitiva para listar os resíduos que sua empresa gera, especificando os tipos, quantidades e condições. Paralelamente, explore o catálogo de materiais disponíveis de outras empresas. Seja para encontrar uma solução sustentável para seus resíduos ou para adquirir matérias-primas a custos mais vantajosos, nossa plataforma facilita a conexão entre oferta e demanda de diversos materiais (como plásticos, metais, papel, têxteis e muitos outros).
              </p>
            </div>

            {/* Card 3 */}
            <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md">
              <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white">
                3
              </div>
              <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Negocie com outras empresas</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Entre em contato direto com outras empresas interessadas nos seus resíduos ou que oferecem os materiais que você procura. Utilize as ferramentas de comunicação da plataforma para discutir detalhes, negociar preços, condições de troca, venda ou até mesmo doação. Nossa plataforma visa facilitar a criação de relações comerciais transparentes e eficientes, otimizando o fluxo de materiais e promovendo a economia circular.
              </p>
            </div>

            {/* Card 4 */}
            <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md">
              <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white">
                4
              </div>
              <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Acompanhe os impactos</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Visualize de forma clara e objetiva as métricas geradas pelas suas transações na plataforma. Acompanhe a economia de custos obtida com a destinação inteligente de resíduos ou a aquisição de matérias-primas recicladas. Além disso, quantifique sua contribuição para a sustentabilidade através da redução de resíduos enviados para aterros e da diminuição da emissão de poluentes. Tenha dados concretos para demonstrar o valor da sua participação na economia circular.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-10 text-3xl font-extrabold text-[#00A2AA]">
            Juntos por um futuro
            <br />
            mais limpo e colaborativo.
          </h2>
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 text-center text-gray-600 leading-relaxed">
              A RecicloHub é mais que um marketplace de resíduos — é uma rede de colaboração que{" "}
              <span className="font-semibold">transforma passivos ambientais em ativos de valor</span>, fortalece
              cadeias produtivas e{" "}
              <span className="font-semibold">gera impacto positivo no meio ambiente e na economia local</span>.
            </p>
            <p className="text-center text-gray-700 font-bold text-xl leading-relaxed">
              Transforme resíduos em valor. Construa parcerias sustentáveis. Faça parte da nova era industrial.
            </p>
          </div>
        </div>
      </section>
      

      {/* Footer */}
      <footer id="footer" className="bg-[#00757B] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Image src="/RecicloHUB_White.png" alt="RecicloHub" width={150} height={40} className="mb-4 h-8 w-auto" />
              <p className="text-sm md:text-base text-white font-bold">
                Conectando indústrias para um futuro mais sustentável através da economia circular e colaboração.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Links</h3>
              <ul className="space-y-2 text-white">
                <li>
                  <Link href="#benefits" className="hover:text-gray-300 hover:cursor-pointer">
                    Benefícios
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-gray-300 hover:cursor-pointer">
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="#mission" className="hover:text-gray-300 hover:cursor-pointer">
                    Sobre Nós
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contato</h3>
              <a
                href="mailto:reciclohub@gmail.com"
                className="mb-2 text-white hover:text-gray-300 hover:cursor-pointer"
                rel="noopener noreferrer"
              >
                reciclohub@gmail.com
              </a>
              <p className="text-white">Caruaru-PE</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}