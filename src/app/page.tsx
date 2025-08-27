"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatedSection, AnimatedText, AnimatedCard } from './components/animations';

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
            <Image src="/reciclohub.newLogo.svg" alt="RecicloHub" width={300} height={40} className="h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex font-semibold items-center space-x-6">
            <Link href="#benefits" className="text-[#999999] hover:text-teal-600 text-sm md:text-base">
              Benefícios
            </Link>
            <Link href="#how-it-works" className="text-[#999999] hover:text-teal-600 text-sm md:text-base">
              Como Funciona
            </Link>
            <Link href="#mission" className="text-[#999999] hover:text-teal-600 text-sm md:text-base">
              Sobre Nós
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[#00A2AA] px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-teal-600"
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
                  className="text-gray-600 hover:text-teal-600  text-lg font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Benefícios
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-600 hover:text-teal-600 text-lg font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                <Link
                  href="#mission"
                  className="text-gray-600 hover:text-teal-600 text-lg font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Sobre Nós
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-[#00A2AA] px-6 py-3 text-white font-semibold hover:bg-teal-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Cadastre-se
                </Link>
                <Link
                  href="/login"
                  className="rounded-md bg-[#00A2AA] px-6 py-3 text-white font-semibold hover:bg-teal-600"
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
      <section
        className="relative py-16 md:py-48 h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/wallpaper.png')"
        }}
      >
        {/* Overlay preto com 80% de opacidade */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="mb-6 text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Conectando Indústrias,
            <br />
            Transformando Resíduos em
            <br />
            Oportunidades
          </h1>
          <p className="mx-auto mb-10 max-w-2xl font-semibold text-sm md:text-lg text-white leading-relaxed">
            Uma plataforma digital para troca e venda de resíduos industriais entre empresas, promovendo a
            simbiose industrial e impulsionando a economia circular em Pernambuco.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <Link
              href="/register"
              className="rounded-full bg-[#00A2AA] px-6 py-3 text-sm font-semibold md:text-base text-white hover:bg-[#00A2AA]/80"
            >
              Cadastre sua empresa
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border-2 border-white font-semibold bg-white px-6 py-3 text-sm md:text-base text-[#00A2AA] hover:bg-gray-100"
            >
              Saiba como funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <AnimatedSection id="benefits-section" delay={50}>
        <section id="benefits" className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <AnimatedText delay={25}>
              <h1 className="mb-16 text-center lg:text-left text-3xl md:text-4xl font-extrabold text-[#00A2AA]">
                Por que usar nossa plataforma?
              </h1>
            </AnimatedText>
            
            {/* Cards Container */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12 justify-items-center xl:justify-items-stretch">
              {/* Card 1 */}
              <AnimatedCard delay={50} index={0}>
                <div className="w-full max-w-sm xl:max-w-none min-w-[320px] h-[400px] rounded-lg bg-[#00A2AA]/14 p-8 text-left border border-gray-200 text-[#5B5858] flex flex-col justify-start shadow-lg backdrop-blur-sm transition-all duration-500 ease-out">
                  <h3 className="text-xl font-bold mb-6 text-[#5B5858] overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>Ganhos Econômicos</h3>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-base font-medium text-[#716F6F] leading-relaxed overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 12,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '288px'
                    }}>
                      Reduza seus custos operacionais ao diminuir significativamente as despesas com o descarte de resíduos. Além disso, transforme o que antes era um problema em uma nova fonte de receita através da venda inteligente de resíduos.
                    </p>
                  </div>
                </div>
              </AnimatedCard>

              {/* Card 2 */}
              <AnimatedCard delay={75} index={1}>
                <div className="w-full max-w-sm xl:max-w-none min-w-[320px] h-[400px] rounded-lg bg-[#00A2AA]/14 p-8 text-left border border-gray-200 text-[#5B5858] flex flex-col justify-start shadow-lg backdrop-blur-sm transition-all duration-500 ease-out">
                  <h3 className="text-xl font-bold mb-6 text-[#5B5858] overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>Sustentabilidade Prática</h3>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-base font-medium text-[#716F6F] leading-relaxed overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 12,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '288px'
                    }}>
                      Contribua ativamente para um futuro mais verde ao reduzir o volume de resíduos destinados a aterros sanitários e diminuir a emissão de gases como o CO2 em suas operações. Demonstre seu compromisso ambiental e fortaleça a reputação da sua empresa junto a clientes e investidores.
                    </p>
                  </div>
                </div>
              </AnimatedCard>

              {/* Card 3 */}
              <AnimatedCard delay={100} index={2}>
                <div className="w-full max-w-sm xl:max-w-none min-w-[320px] h-[400px] rounded-lg bg-[#00A2AA]/14 p-8 text-left border border-gray-200 text-[#5B5858] flex flex-col justify-start shadow-lg backdrop-blur-sm transition-all duration-500 ease-out">
                  <h3 className="text-xl font-bold mb-6 text-[#5B5858] overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>Conexões Inteligentes</h3>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-base font-medium text-[#716F6F] leading-relaxed overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 12,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '288px'
                    }}>
                      Amplie sua rede de contatos com empresas que possuem interesse nos seus resíduos ou que podem fornecer os materiais que você necessita. Estabeleça relações comerciais mutuamente benéficas e sustentáveis, impulsionando a economia circular em sua cadeia de valor.
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* About Us Section */}
      <AnimatedSection delay={25}>
        <section id="mission" className="py-16 md:py-32 bg-[#00757B]">
          <div className="container mx-auto px-4">
            <AnimatedText delay={50}>
              <h2 className="mb-12 text-left text-3xl md:text-4xl font-extrabold text-white">Sobre Nós</h2>
            </AnimatedText>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              {/* Coluna 1 */}
              <AnimatedText delay={100}>
                <div className="text-left w-auto">
                  <p className="mb-6 text-sm md:text-base text-white leading-relaxed">
                    Mais do que uma plataforma, somos um ecossistema que conecta empresas, promovendo a economia circular e transformando resíduos em oportunidades de negócio, visando um futuro mais sustentável e colaborativo. Buscamos alinhar os interesses das empresas com as necessidades ambientais, criando um impacto positivo que vai além do lucro imediato.
                  </p>
                  <p className="mb-6 text-sm md:text-base text-white leading-relaxed">
                    Seja através de nosso marketplace para transformar aquele resíduo que seria descartado em uma nova fonte de renda, como também através de ferramentas de gerenciamento destes resíduos, facilitando a emissão de relatórios PGRS, o RecicloHub se propõe a ser o parceiro ideal para empresas comprometidas com a sustentabilidade, oferecendo suporte para cada etapa do processo. 
                  </p>
                </div>
              </AnimatedText>

              {/* Coluna 2 */}

            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* How it Works Section */}
      <AnimatedSection delay={25}>
        <section id="how-it-works" className="bg-[#83D5D9]/15 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <AnimatedText delay={25}>
              <h2 className="mb-12 text-center text-3xl md:text-4xl font-black text-[#00A2AA]">Como Funciona?</h2>
            </AnimatedText>
            <div className="grid gap-12 md:grid-cols-2">
              {/* Card 1 */}
              <AnimatedCard delay={50} index={0}>
                <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md backdrop-blur-sm border border-white/20 transition-all duration-500 ease-out">
                  <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white shadow-xl">
                    1
                  </div>
                  <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Cadastre sua empresa</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Dedique alguns minutos para registrar sua empresa em nossa plataforma. Informe detalhes cruciais como o setor de atuação, a localização geográfica e os tipos de materiais (resíduos ou matérias-primas) com os quais você trabalha ou tem interesse. Ao fornecer informações precisas, você aumenta suas chances de ser encontrado por parceiros relevantes e de descobrir oportunidades que realmente se encaixam no seu negócio.
                  </p>
                </div>
              </AnimatedCard>

              {/* Card 2 */}
              <AnimatedCard delay={75} index={1}>
                <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md backdrop-blur-sm border border-white/20 transition-all duration-500 ease-out">
                  <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white shadow-xl">
                    2
                  </div>
                  <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Ofereça ou busque resíduos</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Utilize nossa interface intuitiva para listar os resíduos que sua empresa gera, especificando os tipos, quantidades e condições. Paralelamente, explore o catálogo de materiais disponíveis de outras empresas. Seja para encontrar uma solução sustentável para seus resíduos ou para adquirir matérias-primas a custos mais vantajosos, nossa plataforma facilita a conexão entre oferta e demanda de diversos materiais (como plásticos, metais, papel, têxteis e muitos outros).
                  </p>
                </div>
              </AnimatedCard>

              {/* Card 3 */}
              <AnimatedCard delay={100} index={2}>
                <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md backdrop-blur-sm border border-white/20 transition-all duration-500 ease-out">
                  <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white shadow-xl">
                    3
                  </div>
                  <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Negocie com outras empresas</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Entre em contato direto com outras empresas interessadas nos seus resíduos ou que oferecem os materiais que você procura. Utilize as ferramentas de comunicação da plataforma para discutir detalhes, negociar preços, condições de troca, venda ou até mesmo doação. Nossa plataforma visa facilitar a criação de relações comerciais transparentes e eficientes, otimizando o fluxo de materiais e promovendo a economia circular.
                  </p>
                </div>
              </AnimatedCard>

              {/* Card 4 */}
              <AnimatedCard delay={125} index={3}>
                <div className="relative flex flex-col items-start text-left rounded-lg bg-white p-8 shadow-md backdrop-blur-sm border border-white/20 transition-all duration-500 ease-out">
                  <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#00A2AA] text-xl font-semibold text-white shadow-xl">
                    4
                  </div>
                  <h3 className="mt-10 mb-4 text-lg md:text-xl font-bold text-[#5B5858]">Acompanhe os impactos</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Visualize de forma clara e objetiva as métricas geradas pelas suas transações na plataforma. Acompanhe a economia de custos obtida com a destinação inteligente de resíduos ou a aquisição de matérias-primas recicladas. Além disso, quantifique sua contribuição para a sustentabilidade através da redução de resíduos enviados para aterros e da diminuição da emissão de poluentes. Tenha dados concretos para demonstrar o valor da sua participação na economia circular.
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>
      </AnimatedSection>


            {/* FAQ Section */}
      <AnimatedSection delay={25}>
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <AnimatedText delay={50}>
              <h2 className="mb-12 text-center text-3xl md:text-4xl font-extrabold text-[#00A2AA]">Perguntas Frequentes</h2>
            </AnimatedText>
            <div className="mx-auto max-w-3xl space-y-6">
              
              {/* FAQ Item 1 */}
              <AnimatedCard delay={50} index={0}>
                <details className="group rounded-lg bg-[#00A2AA]/14 p-6 shadow-md backdrop-blur-sm border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                  <summary className="flex cursor-pointer items-center justify-between text-lg font-bold text-[#00757B] hover:text-[#00A2AA] transition-colors duration-200">
                    Como funciona o cadastro na plataforma?
                    <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    O cadastro é simples e gratuito. Você precisa fornecer informações básicas sobre sua empresa, como setor de atuação, 
                    localização e tipos de resíduos ou matérias-primas de interesse. Após a aprovação, você terá acesso completo à plataforma.
                  </p>
                </details>
              </AnimatedCard>

              {/* FAQ Item 2 */}
              <AnimatedCard delay={75} index={1}>
                <details className="group rounded-lg bg-[#00A2AA]/14 p-6 shadow-md backdrop-blur-sm border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                  <summary className="flex cursor-pointer items-center justify-between text-lg font-bold text-[#00757B] hover:text-[#00A2AA] transition-colors duration-200">
                    Quais tipos de resíduos podem ser negociados?
                    <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Nossa plataforma aceita diversos tipos de resíduos industriais, incluindo metais, plásticos, papel, vidro, 
                    materiais orgânicos e químicos (dentro das normas de segurança). Cada tipo de resíduo passa por verificação 
                    para garantir conformidade legal e ambiental.
                  </p>
                </details>
              </AnimatedCard>

              {/* FAQ Item 3 */}
              <AnimatedCard delay={100} index={2}>
                <details className="group rounded-lg bg-[#00A2AA]/14 p-6 shadow-md backdrop-blur-sm border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                  <summary className="flex cursor-pointer items-center justify-between text-lg font-bold text-[#00757B] hover:text-[#00A2AA] transition-colors duration-200">
                    Como é garantida a segurança nas transações?
                    <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Implementamos um sistema robusto de verificação de empresas, avaliações mútuas e acompanhamento de transações. 
                    Todas as negociações seguem protocolos de segurança e conformidade legal, garantindo transparência e confiabilidade 
                    para todos os usuários.
                  </p>
                </details>
              </AnimatedCard>

              {/* FAQ Item 4 */}
              <AnimatedCard delay={125} index={3}>
                <details className="group rounded-lg bg-[#00A2AA]/14 p-6 shadow-md backdrop-blur-sm border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                  <summary className="flex cursor-pointer items-center justify-between text-lg font-bold text-[#00757B] hover:text-[#00A2AA] transition-colors duration-200">
                    Existe algum custo para usar a plataforma?
                    <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    O cadastro e uso básico da plataforma são gratuitos. Cobramos apenas uma pequena taxa de sucesso sobre 
                    transações completadas, garantindo que você só pague quando realmente obtiver resultados. 
                    Oferecemos também planos premium com funcionalidades avançadas.
                  </p>
                </details>
              </AnimatedCard>

              {/* FAQ Item 5 */}
              <AnimatedCard delay={150} index={4}>
                <details className="group rounded-lg bg-[#00A2AA]/14 p-6 shadow-md backdrop-blur-sm border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                  <summary className="flex cursor-pointer items-center justify-between text-lg font-bold text-[#00757B] hover:text-[#00A2AA] transition-colors duration-200">
                    Como posso maximizar minhas chances de encontrar parceiros?
                    <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Mantenha seu perfil sempre atualizado, forneça descrições detalhadas dos seus resíduos/necessidades, 
                    adicione fotos quando possível e responda rapidamente às propostas. Empresas ativas e bem detalhadas 
                    têm 3x mais chances de fazer negócios na plataforma.
                  </p>
                </details>
              </AnimatedCard>

            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Mission Section */}
      <AnimatedSection delay={25}>
        <section id="mission" className="py-16">
          <div className="container mx-auto px-4 text-center">
            <AnimatedText delay={25}>
              <h2 className="mb-10 text-3xl font-extrabold text-[#00A2AA]">
                Juntos por um futuro
                <br />
                mais limpo e colaborativo.
              </h2>
            </AnimatedText>
            <div className="mx-auto max-w-3xl">
              <AnimatedText delay={50}>
                <p className="mb-8 text-center text-gray-600 leading-relaxed">
                  A RecicloHub é mais que um marketplace de resíduos — é uma rede de colaboração que{" "}
                  <span className="font-semibold">transforma passivos ambientais em ativos de valor</span>, fortalece
                  cadeias produtivas e{" "}
                  <span className="font-semibold">gera impacto positivo no meio ambiente e na economia local</span>.
                </p>
              </AnimatedText>
              <AnimatedText delay={75}>
                <p className="text-center text-gray-700 font-bold text-xl leading-relaxed">
                  Transforme resíduos em valor. Construa parcerias sustentáveis. Faça parte da nova era industrial.
                </p>
              </AnimatedText>
            </div>
          </div>
        </section>
      </AnimatedSection>




      {/* Footer */}
      <footer id="footer" className="bg-[#00757B] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Image src="/reciclohub.newLogo.svg" alt="RecicloHub" width={150} height={40} className="mb-4 h-8 w-auto" />
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