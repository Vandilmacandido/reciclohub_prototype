"use client"

import React, { useState, useEffect } from "react"
import { RotateCcw, ChevronLeft, Eye, EyeOff, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterStep3() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptPrivacy: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const step1Data = localStorage.getItem("registrationStep1")
    const step2Data = localStorage.getItem("registrationStep2")
    if (!step1Data || !step2Data) {
      router.push("/register")
      return
    }
  }, [router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos de uso"
    }
    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = "Você deve aceitar a política de privacidade"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // Pegue os dados das etapas anteriores
        const step1Data = JSON.parse(localStorage.getItem("registrationStep1") || "{}")
        const step2Data = JSON.parse(localStorage.getItem("registrationStep2") || "{}")
        const completeRegistrationData = {
          ...step1Data,
          ...step2Data,
          password: formData.password,
          acceptTerms: formData.acceptTerms,
          acceptPrivacy: formData.acceptPrivacy,
        }

        // Envie para a API de cadastro (register-user)
        const response = await fetch("/api/register-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completeRegistrationData),
        })

        if (response.ok) {
          // Simule login: salve um token fake
          localStorage.setItem("authToken", "fake-token")
          // Limpe os dados temporários
          localStorage.removeItem("registrationStep1")
          localStorage.removeItem("registrationStep2")
          // Redirecione para o feed
          router.replace("/feed")
        } else {
          // Trate erro de cadastro
          const error = await response.json()
          if (error.error === "E-mail já cadastrado.") {
            alert("E-mail já cadastrado. Faça login ou recupere sua senha.")
          } else if (error.error === "CNPJ já cadastrado.") {
            alert("CNPJ já cadastrado. Verifique seus dados ou entre em contato.")
          } else {
            alert(error.error || "Erro ao cadastrar usuário.")
          }
        }
      } catch (error) {
        console.error(error)
        // Se desejar, adicione um feedback visual para o usuário aqui
      }
    }
  }

  const isFormValid = () => {
    return (
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.acceptTerms &&
      formData.acceptPrivacy
    )
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
            <div className="w-8 h-1 bg-teal-600 rounded-full"></div>
            <div className="w-8 h-1 bg-teal-600 rounded-full"></div>
            <div className="w-8 h-1 bg-teal-400 rounded-full"></div>
          </div>
          <p className="text-sm text-teal-600">Etapa 3 de 3 - Finalizar Cadastro</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-medium text-teal-700">Criar Senha</h3>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-teal-600 font-medium text-sm">
                Senha *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 ${
                    errors.password ? "border-red-400 focus:border-red-600" : "border-teal-400 focus:border-teal-600"
                  }`}
                  placeholder="Mínimo 8 caracteres"
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
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-teal-600 font-medium text-sm">
                Confirmar Senha *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-600"
                      : "border-teal-400 focus:border-teal-600"
                  }`}
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                  className="border-teal-400 accent-teal-600 mt-1"
                />
                <label htmlFor="acceptTerms" className="text-sm text-teal-700 cursor-pointer leading-relaxed">
                  Aceito os{" "}
                  <a href="/terms" className="font-medium hover:underline" target="_blank" rel="noreferrer">
                    Termos de Uso
                  </a>{" "}
                  da plataforma RecicloHub
                </label>
              </div>
              {errors.acceptTerms && <p className="text-red-500 text-xs ml-6">{errors.acceptTerms}</p>}

              <div className="flex items-start space-x-3">
                <input
                  id="acceptPrivacy"
                  type="checkbox"
                  checked={formData.acceptPrivacy}
                  onChange={(e) => handleInputChange("acceptPrivacy", e.target.checked)}
                  className="border-teal-400 accent-teal-600 mt-1"
                />
                <label htmlFor="acceptPrivacy" className="text-sm text-teal-700 cursor-pointer leading-relaxed">
                  Aceito a{" "}
                  <a href="/privacy" className="font-medium hover:underline" target="_blank" rel="noreferrer">
                    Política de Privacidade
                  </a>{" "}
                  e o tratamento dos meus dados
                </label>
              </div>
              {errors.acceptPrivacy && <p className="text-red-500 text-xs ml-6">{errors.acceptPrivacy}</p>}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              className="flex-1 bg-teal-100 hover:bg-teal-200 text-teal-700 border border-teal-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              onClick={() => router.push("/register/step-2")}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}