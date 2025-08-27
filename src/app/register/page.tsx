"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    cnpj: "",
    telefone: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      const dataToSave = { ...formData, cnpj: formData.cnpj.replace(/\D/g, "") }
      localStorage.setItem("registrationStep1", JSON.stringify(dataToSave))
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br bg-[#00A2AA]/14 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-teal-100">
        {/* Logo e título */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/reciclohub.newLogo.svg"
              alt="RECICLOHUB Logo"
              width={160}
              height={80}
              className="h-16 md:h-20 object-contain"
              priority
            />
          </div>
          <h2 className="text-xl font-semibold text-[#00A2AA] mb-2">Cadastro</h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-1 bg-[#00A2AA] rounded-full"></div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          </div>
          <p className="text-sm text-[#716F6F]">Etapa 1 de 3 - Dados da Empresa</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name Field */}
          <div>
            <label htmlFor="companyName" className="block text-[#5B5858] font-medium text-sm mb-1">
              Nome da Empresa
            </label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full px-4 py-3 border-2 focus:border-[#00A2AA] border-[#00A2AA]/50 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition"
              placeholder="Digite o nome da empresa"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-[#5B5858] font-medium text-sm mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#00A2AA]/50 rounded-lg focus:border-[#00A2AA] focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition"
              placeholder="Digite seu e-mail ex: empresatextil@gmail.com"
              required
            />
          </div>

          {/* CNPJ Field */}
          <div>
            <label htmlFor="cnpj" className="block text-[#5B5858] font-medium text-sm mb-1">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              value={formData.cnpj}
              onChange={(e) => handleCNPJChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#00A2AA]/50 rounded-lg focus:border-[#00A2AA] focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition"
              placeholder="00.000.000/0000-00"
              required
              maxLength={18}
            />
          </div>

          {/* Telefone Field */}
          <div>
            <label htmlFor="telefone" className="block text-[#5B5858] font-medium text-sm mb-1">
              Telefone
            </label>
            <input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleInputChange("telefone", e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#00A2AA]/50 rounded-lg focus:border-[#00A2AA] focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition"
              placeholder="(99) 99999-9999"
              required
            />
          </div>

          {/* Next Button */}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full bg-[#00A2AA] hover:bg-[#008C8C] hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-base shadow`}
          >
            Próximo
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-[#716F6F] text-sm">
            Já possui uma conta?{" "}
            <Link href="/login" className="font-medium underline hover:text-[#716F6F] transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}