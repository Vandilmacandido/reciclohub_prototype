"use client"
import { useState } from "react"
import { X } from "lucide-react"

interface Offer {
  id: number
  company: string
  wasteType: string
  quantity: string
  // Adicione outros campos se necessário
}

interface ProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  offer: Offer | null
}

export function ProposalModal({ isOpen, onClose, onSubmit, offer }: ProposalModalProps) {
  const [formData, setFormData] = useState({
    quantity: "",
    frequency: "",
    price: "",
    message: "",
    transportType: "",
  })
  const [success, setSuccess] = useState(false)

  if (!isOpen || !offer) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      onClose()
    }, 1800)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Fazer Proposta</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Offer Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{offer.company}</h3>
            <p className="text-sm text-gray-600 mb-2">{offer.wasteType}</p>
            <p className="text-sm text-gray-600">Disponível: {offer.quantity}</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-3xl mb-2">✓</div>
              <div className="text-green-700 font-semibold mb-1">Proposta enviada com sucesso!</div>
              <div className="text-gray-600 text-sm">O responsável pelo resíduo será notificado.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-teal-700">
                  Quantidade Desejada *
                </label>
                <input
                  id="quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="Ex: 100 kg"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-400 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="frequency" className="block text-sm font-medium text-teal-700">
                  Frequência de Coleta *
                </label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => handleInputChange("frequency", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-400 placeholder-gray-400"
                >
                  <option value="" className="text-gray-400">Selecione a frequência</option>
                  <option value="semanal" className="text-gray-400">Semanal</option>
                  <option value="quinzenal" className="text-gray-400">Quinzenal</option>
                  <option value="mensal" className="text-gray-400">Mensal</option>
                  <option value="unica" className="text-gray-400">Coleta Única</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="transportType" className="block text-sm font-medium text-teal-700">
                  Tipo de Transporte *
                </label>
                <select
                  id="transportType"
                  value={formData.transportType}
                  onChange={(e) => handleInputChange("transportType", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-400 placeholder-gray-400"
                >
                  <option value="" className="text-gray-400">Como será o transporte?</option>
                  <option value="proprio" className="text-gray-400">Transporte Próprio</option>
                  <option value="terceirizado" className="text-gray-400">Transporte Terceirizado</option>
                  <option value="fornecedor" className="text-gray-400">Transporte pelo Fornecedor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-teal-700">
                  Proposta de Preço
                </label>
                <input
                  id="price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Ex: R$ 2,00/kg ou Gratuito"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-400 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500">Deixe em branco para aceitar o preço sugerido</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-teal-700">
                  Mensagem (Opcional)
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded resize-none h-20 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-400 placeholder-gray-400"
                  placeholder="Adicione informações extras sobre sua proposta..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Enviar Proposta
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}