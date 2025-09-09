"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FiLock as Lock, FiEye as Eye, FiEyeOff as EyeOff, FiChevronLeft as ChevronLeft } from "react-icons/fi"

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
        const completeRegistrationData = {
          ...step1Data,
          ...JSON.parse(localStorage.getItem("registrationStep2") || "{}"),
          password: formData.password,
          acceptTerms: formData.acceptTerms,
          acceptPrivacy: formData.acceptPrivacy,
        }

        // Envie para a API de cadastro (register-user)
        const response = await fetch("/actions/api/user/register-industry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completeRegistrationData),
        })

        if (response.ok) {
          localStorage.removeItem("registrationStep1")
          localStorage.removeItem("registrationStep2")
          router.replace("/register/success")
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
    // Retrieve previous steps' data for validation
    const step1Data = JSON.parse(localStorage.getItem("registrationStep1") || "{}")
    const emailValid = typeof step1Data.email === "string" && step1Data.email.includes("@")
    const cnpjNumbers = typeof step1Data.cnpj === "string" ? step1Data.cnpj.replace(/\D/g, "") : ""
    const companyNameValid = typeof step1Data.companyName === "string" && step1Data.companyName.trim().length > 0
    const telefoneValid = typeof step1Data.telefone === "string" && step1Data.telefone.trim().length > 0 // <-- aqui

    return (
      companyNameValid &&
      emailValid &&
      cnpjNumbers.length === 14 &&
      telefoneValid &&
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
            <Image
              src="/RECICLOHUB_Green.png"
              alt="RECICLOHUB Logo"
              width={160}
              height={80}
              className="h-16 md:h-20 object-contain"
              priority
            />
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
                  autoComplete="new-password"
                  inputMode="text"
                  className={`appearance-none w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 ${
                    errors.password ? "border-red-400 focus:border-red-600" : "border-teal-400 focus:border-teal-600"
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-700 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
                  autoComplete="new-password"
                  inputMode="text"
                  className={`appearance-none w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-0 bg-white text-gray-900 placeholder-gray-400 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-600"
                      : "border-teal-400 focus:border-teal-600"
                  }`}
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-700 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
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
                  className="border-teal-400 cursor-pointer accent-teal-600 mt-1"
                />
                <label htmlFor="acceptTerms" className="text-sm text-teal-700 cursor-pointer leading-relaxed">
                  Aceito os{" "}
                  <a href="/terms" className="font-medium underline" target="_blank" rel="noreferrer">
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
                  className="border-teal-400 cursor-pointer accent-teal-600 mt-1"
                />
                <label htmlFor="acceptPrivacy" className="text-sm text-teal-700 cursor-pointer leading-relaxed">
                  Aceito a{" "}
                  <a href="/privacy" className="font-medium underline" target="_blank" rel="noreferrer">
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
              className="flex-1 bg-[#7FD0D4] hover:bg-[#00A2AA] text-white border border-teal-300 hover:cursor-pointer font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              onClick={() => router.push("/register")}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="flex-1 bg-teal-600 cursor-pointer hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}