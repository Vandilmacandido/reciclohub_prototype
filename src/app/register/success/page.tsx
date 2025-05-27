"use client"

import React from "react"
import { RotateCcw } from "lucide-react"
import Link from "next/link"

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
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
          <h2 className="text-xl font-medium text-teal-600 mb-2">Cadastro concluído!</h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-1 bg-teal-600 rounded-full"></div>
            <div className="w-8 h-1 bg-teal-600 rounded-full"></div>
            <div className="w-8 h-1 bg-teal-600 rounded-full"></div>
          </div>
          <p className="text-sm text-teal-600">
            Sua conta foi criada com sucesso.<br />
            Agora você pode acessar a plataforma RecicloHub!
          </p>
        </div>
        <div className="pt-8 flex flex-col items-center">
          <Link
            href="/login"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-base text-center"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  )
}