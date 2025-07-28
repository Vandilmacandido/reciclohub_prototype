"use client";

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";


interface UserProfile {
  name: string;
  role: string;
}

// Contexto para título dinâmico
const PageTitleContext = createContext<string>("RecicloHub");
export function usePageTitle() {
  return useContext(PageTitleContext);
}


export function MainLayout({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pageTitle = usePageTitle();
  const pathname = usePathname();

  // Fallback: gera título a partir da rota se contexto não for definido
  // Mapeamento de rotas para títulos amigáveis (igual à sidebar)
  const routeTitles: Record<string, string> = {
    "chat": "Conversas",
    "proposals": "Propostas",
    "received": "Propostas Recebidas",
    "feed": "Feed",
    "residues": "Resíduos",
    "register": "Cadastro",
    "my-offers": "Minhas Ofertas",
    "edit-residues": "Editar Resíduo",
    "notifications": "Notificações",
    // Adicione outros conforme necessário
  };

  function getFallbackTitle() {
    if (pageTitle && pageTitle !== "RecicloHub") return pageTitle;
    if (!pathname || pathname === "/") return "RecicloHub";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "RecicloHub";
    let last = parts[parts.length - 1];
    // Se for id dinâmico, pega o anterior
    if (last.startsWith("[")) last = parts[parts.length - 2] || last;
    // Usa o mapeamento se existir
    if (routeTitles[last]) return routeTitles[last];
    // Fallback: capitaliza
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserProfile({
          name: userData.nome || userData.name || "Usuário",
          role: userData.role || userData.papel || "Usuário"
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F4FBFB] md:ml-64 pt-16 md:pt-0">
      <Navbar />
      {/* HEADER PADRÃO */}
      <div
        className="w-full bg-white shadow-sm py-3 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
        style={{ minHeight: 64 }}
      >
        {/* Título */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <span className="text-xl sm:text-2xl font-bold text-teal-700 tracking-tight truncate">{getFallbackTitle()}</span>
        </div>
        {/* Barra de busca removida */}
        {/* Notificação e Perfil */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0 justify-end">
          {/* Botão de notificação - oculto em mobile */}
          <button className="relative p-2 rounded-full hover:bg-teal-50 focus:outline-none hidden sm:inline-flex">
            {/* Ícone de sino SVG inline para evitar dependência */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {/* Badge de notificação (exemplo, pode ser dinâmico depois) */}
            {/* <span className="absolute top-1 right-1 w-3 h-3 bg-red-600 rounded-full"></span> */}
          </button>
          {/* <Link href="/profile" ...> ... </Link> */}
          <div className="items-center gap-2 min-w-0 sm:flex hidden group opacity-60 cursor-not-allowed select-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
              {userProfile?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight truncate max-w-[80px] sm:max-w-[120px]">{userProfile?.name || "Usuário"}</span>
              <span className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[80px] sm:max-w-[120px]">{userProfile?.role || "Usuário"}</span>
            </div>
          </div>
        </div>
      </div>
      {/* FIM HEADER */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
// Provider para envolver a aplicação e definir o título da página
export function PageTitleProvider({ title, children }: { title: string; children: ReactNode }) {
  return <PageTitleContext.Provider value={title}>{children}</PageTitleContext.Provider>;
}
