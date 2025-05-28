"use client"

import React, { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Home() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Se já estiver logado, redireciona para o feed
    if (typeof window !== "undefined" && localStorage.getItem("authToken")) {
      router.replace("/feed")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Consulta o usuário pelo email
    const res = await fetch(`/api/consult-user?email=${encodeURIComponent(email)}`)
    const users = await res.json()

    if (users.length === 0) {
      alert("Usuário não encontrado. Cadastre-se para acessar a plataforma.")
      return
    }

    // Verifica a senha (atenção: senha em texto puro, apenas para protótipo)
    const user = users[0]
    if (user && user.password === password) {
      localStorage.setItem("authToken", "fake-token")
      localStorage.setItem("userId", user.id) // Salva o id do usuário
      router.replace("/feed")
    } else {
      alert("Senha incorreta.")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            {/* Imagem do logo */}
            <Image
              src="/RECICLOHUB_Green.png"
              alt="RECICLOHUB_Green"
              width={160}
              height={80}
              className="h-16 md:h-20 object-contain"
            />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-teal-600 font-medium text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:border-teal-600 focus:ring-0 bg-white text-gray-900 placeholder-gray-400"
              placeholder="Digite seu email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-teal-600 font-medium text-sm">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-teal-400 rounded-lg focus:border-teal-600 focus:ring-0 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Keep logged in and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="border-teal-400 accent-teal-600"
              />
              <label htmlFor="keep-logged-in" className="text-sm text-teal-600 cursor-pointer">
                Manter conectado
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-teal-600 hover:text-teal-700 hover:underline transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-base"
          >
            Entrar
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center pt-4">
          <p className="text-teal-600 text-sm">
            Ainda não possui conta?{" "}
            <Link href="/register" className="font-medium hover:underline transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}