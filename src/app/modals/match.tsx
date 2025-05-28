"use client"
import { Heart, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import React from "react"

interface Offer {
  id: string
  company: string
  // Adicione outros campos se necessário
}

interface ProposalAccepted {
  id: string
  company: string
  notifiedUserIds?: string[]
  // Adicione outros campos se necessário
}

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  offer: Offer | null
}

export function MatchModal({ isOpen, onClose, offer }: MatchModalProps) {
  if (!isOpen || !offer) return null

  // Função para iniciar conversa e marcar como notificado
  const handleStartChat = async () => {
    await onClose()
    window.location.href = `/chat/${offer.id}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        {/* Match Animation */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-10 h-10 text-white fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">É um Match!</h2>
          <p className="text-gray-600">
            Sua proposta foi aceita por <span className="font-semibold">{offer.company}</span>
          </p>
        </div>

        {/* Match Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">EU</span>
              </div>
              <p className="text-xs text-gray-600">Você</p>
            </div>
            <Heart className="w-6 h-6 text-teal-600 fill-current" />
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-600 font-bold text-xs">
                  {typeof offer.company === "string" && offer.company.length > 0
                    ? offer.company.charAt(0)
                    : "?"}
                </span>
              </div>
              <p className="text-xs text-gray-600">{offer.company}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded px-4 py-3 flex items-center justify-center gap-2"
            onClick={handleStartChat}
          >
            <MessageCircle className="w-4 h-4" />
            Iniciar Conversa
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-gray-300 rounded px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            Continuar Navegando
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Agora vocês podem conversar e finalizar os detalhes da negociação!
        </p>
      </div>
    </div>
  )
}

// Componente para exibir o MatchModal quando houver match aceito
export function MatchModalContainer() {
  // Pega o userId real do usuário logado
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedOffer, setMatchedOffer] = useState<Offer | null>(null)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/proposals-accepted?userId=${userId}`)
      .then(res => res.json())
      .then((data: ProposalAccepted[]) => {
        // Só pega matches que ainda não foram notificados para este user
        const notNotified = data.find(
          (proposal) =>
            !proposal.notifiedUserIds || !proposal.notifiedUserIds.includes(userId)
        )
        if (notNotified) {
          setMatchedOffer(notNotified)
          setShowMatchModal(true)
        }
      })
  }, [userId])

  const handleClose = async () => {
    setShowMatchModal(false)
    if (matchedOffer) {
      await fetch("/api/proposal-match-unique", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: matchedOffer.id, userId }),
      })
    }
  }

  return (
    <MatchModal
      isOpen={showMatchModal}
      onClose={handleClose}
      offer={matchedOffer}
    />
  )
}