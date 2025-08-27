"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, ChevronLeft } from "lucide-react"

export default function RegisterStep2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cep: "",
    street: "",
    numero: "",
    city: "",
    state: "Pernambuco",
    country: "Brasil",
  })

  const [cepLoading, setCepLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const step1Data = localStorage.getItem("registrationStep1")
    if (!step1Data) {
      router.push("/register")
      return
    }
    // Se quiser preencher algum campo a partir do step1, faça aqui
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const handleCEPChange = async (value: string) => {
    const formatted = formatCEP(value)
    if (formatted.length <= 9) {
      handleInputChange("cep", formatted)
      if (formatted.length === 9) {
        setCepLoading(true)
        try {
          const cepNumbers = formatted.replace(/\D/g, "")
          const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`)
          const data = await response.json()
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              street: data.logradouro || "",
              city: data.localidade || "",
              state: data.uf || "",
            }))
          }
        } finally {
          setCepLoading(false)
        }
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.cep || formData.cep.length !== 9) {
      newErrors.cep = "CEP deve ter 8 dígitos"
    }
    if (!formData.street.trim()) {
      newErrors.street = "Endereço é obrigatório"
    }
    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória"
    }
    if (!formData.state) {
      newErrors.state = "Estado é obrigatório"
    }
    if (!formData.numero.trim()) {
      newErrors.numero = "Número é obrigatório"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      localStorage.setItem("registrationStep2", JSON.stringify(formData))
      router.push("/register/step-3")
    }
  }

  const isFormValid = () => {
    return (
      formData.cep.length === 9 &&
      formData.street.trim() &&
      formData.city.trim() &&
      formData.state &&
      formData.country.trim() &&
      formData.numero.trim()
    )
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
            <div className="w-8 h-1 bg-[#00A2AA] rounded-full"></div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          </div>
          <p className="text-sm text-[#716F6F]">Etapa 2 de 3 - Informações de Contato</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-medium text-teal-700">Endereço</h3>
            </div>

            {/* CEP */}
            <div className="space-y-2">
              <label htmlFor="cep" className="block text-[#5B5858] font-medium text-sm mb-1">
                CEP *
              </label>
              <input
                id="cep"
                type="text"
                value={formData.cep}
                onChange={(e) => handleCEPChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition ${
                  errors.cep ? "border-red-400 focus:border-red-600" : "border-[#00A2AA]/50 focus:border-[#00A2AA]"
                }`}
                placeholder="00000-000"
                disabled={cepLoading}
              />
              {errors.cep && <p className="text-red-500 text-xs">{errors.cep}</p>}
            </div>

            {/* Street */}
            <div className="space-y-2">
              <label htmlFor="street" className="block text-[#5B5858] font-medium text-sm mb-1">
                Endereço *
              </label>
              <input
                id="street"
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition ${
                  errors.street ? "border-red-400 focus:border-red-600" : "border-[#00A2AA]/50 focus:border-[#00A2AA]"
                }`}
                placeholder="Rua, Avenida..."
              />
              {errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}
            </div>

            {/* Número */}
            <div className="space-y-2">
              <label htmlFor="numero" className="block text-[#5B5858] font-medium text-sm mb-1">
                Número *
              </label>
              <input
                id="numero"
                type="text"
                value={formData.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition ${
                  errors.numero ? "border-red-400 focus:border-red-600" : "border-[#00A2AA]/50 focus:border-[#00A2AA]"
                }`}
                placeholder="Número"
                required
              />
              {errors.numero && <p className="text-red-500 text-xs">{errors.numero}</p>}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-[#5B5858] font-medium text-sm mb-1">
                  Cidade *
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition ${
                    errors.city ? "border-red-400 focus:border-red-600" : "border-[#00A2AA]/50 focus:border-[#00A2AA]"
                  }`}
                  placeholder="Sua cidade"
                />
                {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="block text-[#5B5858] font-medium text-sm mb-1">
                  Estado *
                </label>
                <input
                  id="state"
                  type="text"
                  value="Pernambuco"
                  disabled
                  className="w-full px-4 py-3 border-2 border-[#00A2AA]/50 rounded-lg bg-gray-100 text-gray-900"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label htmlFor="country" className="block text-[#5B5858] font-medium text-sm mb-1">
                País
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#00A2AA]/50 rounded-lg focus:border-[#00A2AA] focus:ring-0 bg-white text-gray-900 placeholder-gray-400 transition"
                placeholder="Brasil"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              className="flex-1 bg-[#00A2AA] hover:bg-[#008C8C] text-white border hover:cursor-pointer font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              onClick={() => router.push("/register")}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="flex-1 bg-[#00A2AA] hover:bg-[#008C8C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Próximo
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-teal-600 text-sm">
            Já possui uma conta?{" "}
            <Link href="/login" className="font-medium hover:text-teal-700 underline transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}