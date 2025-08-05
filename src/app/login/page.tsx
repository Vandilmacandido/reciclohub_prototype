"use client"

import React, { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/feed")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/actions/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao realizar login.")
        setLoading(false)
        return
      }

      // Salva dados essenciais no localStorage
      localStorage.setItem("token", "fake-token")
      localStorage.setItem("user", JSON.stringify({ id: data.id, email: data.email, nome: data.nome }))
      localStorage.setItem("userId", data.id) // id do usuário
      localStorage.setItem("empresaId", data.empresaId) // id da empresa/indústria

      // Redireciona para o feed
      router.replace("/feed")
    } catch {
      setError("Erro ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
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
              autoComplete="username"
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
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5 hover:cursor-pointer" /> : <Eye className="w-5 h-5 hover:cursor-pointer" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Keep logged in and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="border-teal-400 accent-teal-600 cursor-pointer"
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
            className="w-full bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-base"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center pt-4">
          <p className="text-teal-600 text-sm">
            Ainda não possui conta?{" "}
            <Link href="/register" className="font-medium  hover:text-teal-700 underline transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}