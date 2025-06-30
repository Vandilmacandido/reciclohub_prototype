"use client"

import React, { useState } from "react"
import { X, Camera, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CadastrarResiduoPage() {
  const router = useRouter()
  const [residuoData, setResiduoData] = useState({
    tipoResiduo: "",
    descricao: "",
    quantidade: "",
    unidade: "Quilograma por Mês",
    condicoes: "",
    disponibilidade: "",
    preco: "",
    imagens: [] as File[],
  })
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const tiposResiduos = [
    "Plástico PET",
    "Plástico PEAD",
    "Plástico PVC",
    "Plástico PEBD",
    "Plástico PP",
    "Plástico PS",
    "Papel e Papelão",
    "Metal Ferroso",
    "Metal Não-Ferroso",
    "Vidro",
    "Madeira",
    "Têxtil",
    "Eletrônicos",
    "Orgânico",
    "Outros",
  ]

  const unidades = [
    "Quilograma por Mês",
    "Tonelada por Mês",
    "Quilograma por Semana",
    "Tonelada por Semana",
    "Quilograma por Dia",
    "Unidades por Mês",
  ]

  const handleInputChange = (field: string, value: string) => {
    setResiduoData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - residuoData.imagens.length)
      setResiduoData((prev) => ({
        ...prev,
        imagens: [...prev.imagens, ...newImages].slice(0, 5),
      }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setResiduoData((prev) => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = localStorage.getItem("userId")
    const empresaId = localStorage.getItem("empresaId")
    if (!userId || !empresaId) {
      alert("Usuário ou empresa não autenticados. Faça login novamente.")
      router.push("/")
      return
    }

    if (residuoData.imagens.length === 0) {
      alert("Adicione pelo menos 1 imagem do resíduo.")
      return
    }

    setIsLoading(true)

    try {
      // Converte todas as imagens em base64
      console.log("=== FRONTEND DEBUG - CONVERSÃO DE IMAGENS ===")
      console.log("Número de imagens a converter:", residuoData.imagens.length)
      console.log("Tipos dos arquivos:", residuoData.imagens.map(img => img.type))
      console.log("Tamanhos dos arquivos:", residuoData.imagens.map(img => img.size))
      
      const imagensBase64: string[] = await Promise.all(
        residuoData.imagens.map((file, index) => {
          console.log(`Convertendo arquivo ${index + 1}:`, file.name, file.type, file.size)
          return fileToBase64(file)
        })
      )
      
      console.log("=== RESULTADO DA CONVERSÃO ===")
      console.log("Número de imagens convertidas:", imagensBase64.length)
      console.log("Tamanhos das strings base64:", imagensBase64.map(img => img.length))
      console.log("Primeiros chars de cada imagem:", imagensBase64.map(img => img.substring(0, 50)))
      
      const payload = {
        tipoResiduo: residuoData.tipoResiduo,
        descricao: residuoData.descricao,
        quantidade: residuoData.quantidade,
        unidade: residuoData.unidade,
        condicoes: residuoData.condicoes,
        disponibilidade: residuoData.disponibilidade,
        preco: residuoData.preco,
        imagens: imagensBase64,
        empresaId: Number(empresaId),
        userId,
      }

      console.log("=== PAYLOAD FINAL ===")
      console.log("Payload completo (sem imagens):", { ...payload, imagens: `[${payload.imagens.length} imagens]` })
      console.log("Tipo do campo imagens:", typeof payload.imagens)
      console.log("É array?:", Array.isArray(payload.imagens))
      console.log("Primeira imagem no payload:", payload.imagens[0]?.substring(0, 100))

      const response = await fetch("/actions/api/residues/register-residues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("=== RESPOSTA DO SERVIDOR ===")
      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", response.headers)

      if (response.ok) {
        const residuo = await response.json()
        console.log("Resposta do servidor:", residuo)
        alert(`Resíduo cadastrado com sucesso! ${residuo.imagensCreated || 0} imagens foram salvas.`)
        router.push("/my-offers")
      } else {
        const error = await response.json()
        console.error("Erro do servidor:", error)
        alert(error.error || "Erro ao cadastrar resíduo.")
      }
    } catch {
      alert("Erro ao processar imagens.")
    } finally {
      setIsLoading(false)
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(`Convertendo arquivo: ${file.name}, tipo: ${file.type}, tamanho: ${file.size}`)
      
      // Se a imagem for muito grande, vamos comprimí-la
      if (file.size > 500000) { // 500KB
        compressImage(file).then(compressedFile => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            console.log(`Conversão concluída (comprimida). Tamanho do base64: ${result.length}`)
            console.log(`Primeiros 100 chars: ${result.substring(0, 100)}`)
            resolve(result)
          }
          reader.onerror = (error) => {
            console.error("Erro na conversão de base64:", error)
            reject(error)
          }
          reader.readAsDataURL(compressedFile)
        })
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          console.log(`Conversão concluída. Tamanho do base64: ${result.length}`)
          console.log(`Primeiros 100 chars: ${result.substring(0, 100)}`)
          resolve(result)
        }
        reader.onerror = (error) => {
          console.error("Erro na conversão de base64:", error)
          reject(error)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Redimensionar para no máximo 800x600 mantendo proporção
        const maxWidth = 800
        const maxHeight = 600
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height)
        
        // Converter para blob com qualidade reduzida
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            console.log(`Imagem comprimida: ${file.size} -> ${compressedFile.size}`)
            resolve(compressedFile)
          } else {
            resolve(file) // fallback
          }
        }, 'image/jpeg', 0.7) // 70% de qualidade
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const isFormValid = () => {
    return (
      residuoData.tipoResiduo &&
      residuoData.descricao.trim() &&
      residuoData.quantidade &&
      residuoData.condicoes.trim() &&
      residuoData.disponibilidade &&
      residuoData.imagens.length >= 1 &&
      residuoData.imagens.length <= 5
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Cadastrar Novo Resíduo
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white text-teal-600 border border-teal-600 rounded px-4 py-2 text-sm font-medium hover:bg-teal-50 transition"
          >
            Cancelar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50 rounded-lg">
              <Loader2 className="animate-spin w-12 h-12 text-teal-600 mb-2" />
              <span className="text-teal-700 font-medium">Processando imagens...</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Resíduo */}
            <div className="space-y-2">
              <label htmlFor="tipoResiduo" className="text-gray-700 font-medium">
                Tipos de resíduos
              </label>
              <select
                id="tipoResiduo"
                value={residuoData.tipoResiduo}
                onChange={(e) => handleInputChange("tipoResiduo", e.target.value)}
                className="w-full text-gray-400 bg-gray-100 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecione o tipo de resíduo</option>
                {tiposResiduos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label htmlFor="descricao" className="text-gray-700 font-medium">
                Descrição Detalhada do Resíduo
              </label>
              <textarea
                id="descricao"
                value={residuoData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                className="w-full h-32 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 text-gray-400"
                placeholder="Descreva detalhadamente o resíduo, suas características, origem, composição..."
              />
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">Quantidade Gerada (Aproximada)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="number"
                  value={residuoData.quantidade}
                  onChange={(e) => handleInputChange("quantidade", e.target.value)}
                  className="bg-gray-100 border text-gray-400 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                  placeholder="Ex: 500"
                />
                <select
                  value={residuoData.unidade}
                  onChange={(e) => handleInputChange("unidade", e.target.value)}
                  className="bg-gray-100 border text-gray-400 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {unidades.map((unidade) => (
                    <option key={unidade} value={unidade}>
                      {unidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condições de Armazenamento */}
            <div className="space-y-2">
              <label htmlFor="condicoes" className="text-gray-700 font-medium">
                Condições do Armazenamento
              </label>
              <textarea
                id="condicoes"
                value={residuoData.condicoes}
                onChange={(e) => handleInputChange("condicoes", e.target.value)}
                className="w-full h-24 px-3 py-2 bg-gray-100 text-gray-400 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                placeholder="Descreva como o resíduo está armazenado, condições ambientais, embalagem..."
              />
            </div>

            {/* Disponibilidade */}
            <div className="space-y-3">
              <label className="text-gray-700 font-medium">Disponibilidade para</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="retirada"
                    name="disponibilidade"
                    value="retirada"
                    checked={residuoData.disponibilidade === "retirada"}
                    onChange={(e) => handleInputChange("disponibilidade", e.target.value)}
                  />
                  <label htmlFor="retirada" className="text-gray-700 cursor-pointer">
                    Retirada por Terceiro
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="doacao"
                    name="disponibilidade"
                    value="doacao"
                    checked={residuoData.disponibilidade === "doacao"}
                    onChange={(e) => handleInputChange("disponibilidade", e.target.value)}
                  />
                  <label htmlFor="doacao" className="text-gray-700 cursor-pointer">
                    Doação
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="venda"
                    name="disponibilidade"
                    value="venda"
                    checked={residuoData.disponibilidade === "venda"}
                    onChange={(e) => handleInputChange("disponibilidade", e.target.value)}
                  />
                  <label htmlFor="venda" className="text-gray-700 cursor-pointer">
                    Venda (Especificar Preço Abaixo)
                  </label>
                </div>
              </div>
            </div>

            {/* Preço (Opcional) */}
            <div className="space-y-2">
              <label htmlFor="preco" className="text-gray-700 font-medium">
                Preço (Opcional)
              </label>
              <input
                id="preco"
                type="text"
                value={residuoData.preco}
                onChange={(e) => handleInputChange("preco", e.target.value)}
                className="bg-gray-100 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-gray-400 focus:ring-teal-500 placeholder-gray-400"
                placeholder="Ex: R$ 2,50 por kg"
                disabled={residuoData.disponibilidade !== "venda"}
              />
            </div>

            {/* Upload de Imagens */}
            <div className="space-y-3">
              <label className="text-gray-700 font-medium">Foto do Resíduo</label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Clique ou arraste imagem para inserir</p>
                  <p className="text-sm text-gray-400 mt-1">Mínimo 1 e máximo 5 imagens</p>
                </label>
              </div>
              {residuoData.imagens.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {residuoData.imagens.map((image, index) => (
                    <div key={index} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Ofertar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}