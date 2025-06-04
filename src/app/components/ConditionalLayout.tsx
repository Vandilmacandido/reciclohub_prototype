"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import Navbar from "./Navbar"
import { MatchModalContainer } from "@/app/modals/match"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null) // null = loading
  
  // Páginas que não precisam de autenticação - usando useMemo para evitar recriação
  const publicRoutes = useMemo(
    () => [
      '/',
      '/login',
      '/register',
      '/register/step-2',
      '/register/step-3',
      '/register/success'
    ],
    []
  )

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        const loggedIn = !!token && !!user
        setIsLoggedIn(loggedIn)
        
        // Se não estiver logado e tentar acessar rota protegida
        if (!loggedIn && !publicRoutes.includes(pathname)) {
          router.replace('/') // usar replace ao invés de push
        }
      } catch {
        // Removida a variável 'error' não utilizada
        setIsLoggedIn(false)
        if (!publicRoutes.includes(pathname)) {
          router.replace('/')
        }
      }
    }

    // Pequeno delay para evitar flickering
    const timeoutId = setTimeout(checkAuth, 100)
    
    return () => clearTimeout(timeoutId)
  }, [pathname, router, publicRoutes]) // Adicionado publicRoutes às dependências

  // Mostrar loading enquanto verifica autenticação
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-[#F4FBFB] flex items-center justify-center">
        <div className="text-[#009CA6]">Carregando...</div>
      </div>
    )
  }

  // Se estiver em rota pública, não mostrar navbar
  if (publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen bg-[#F4FBFB]">
        {children}
      </div>
    )
  }

  // Se estiver logado, mostrar com navbar
  if (isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F4FBFB] md:ml-64 pt-16 md:pt-0">
          <MatchModalContainer />
          {children}
        </div>
      </>
    )
  }

  // Se não estiver logado e não for rota pública
  return (
    <div className="min-h-screen bg-[#F4FBFB] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#009CA6] mb-4">Redirecionando...</h1>
      </div>
    </div>
  )
}