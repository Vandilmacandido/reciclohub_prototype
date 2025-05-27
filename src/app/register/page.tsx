"use client"

import React, { useState } from "react"
import { RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    cnpj: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      localStorage.setItem("registrationStep1", JSON.stringify(formData))
      router.push("/register/step-2")
    }
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value)
    if (formatted.length <= 18) {
      handleInputChange("cnpj", formatted)
    }
  }

  const isFormValid = () => {
    const emailValid = formData.email.includes("@")
    return formData.companyName.trim() && emailValid && formData.cnpj.length === 18
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl md:text-5xl font-light text-teal-600 tracking-wide">
              recicl
              <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mx-1">
                <RotateCcw className="w-6 h-6 md:w-8 md:h-8 text-teal-600" />
              </span>
              hub
            </h1>
          </div>
          <h2 className="text-xl font-medium text-teal-600 mb-2">CADASTRO</h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-1 bg-teal-400 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-sm text-teal-600">Etapa 1 de 3 - Dados da Empresa</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name Field */}
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-teal-600 font-medium text-sm">
              Nome da Empresa
            </label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:border-teal-600 focus:ring-0 bg-white text-gray-900 placeholder-gray-400"
              placeholder="Digite o nome da empresa"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-teal-600 font-medium text-sm">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:border-teal-600 focus:ring-0 bg-white text-gray-900 placeholder-gray-400"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          {/* CNPJ Field */}
          <div className="space-y-2">
            <label htmlFor="cnpj" className="text-teal-600 font-medium text-sm">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              value={formData.cnpj}
              onChange={(e) => handleCNPJChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:border-teal-600 focus:ring-0 bg-white text-gray-900 placeholder-gray-400"
              placeholder="00.000.000/0000-00"
              required
            />
          </div>

          {/* Next Button */}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-base`}
          >
            Próximo
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-teal-600 text-sm">
            Já possui uma conta?{" "}
            <Link href="/login" className="font-medium hover:underline transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}