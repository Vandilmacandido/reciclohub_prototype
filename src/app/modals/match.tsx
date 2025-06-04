"use client"
import { Heart, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import React from "react"

interface Offer {
  id: string
  company: string
  matchId?: string
}


interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  offer: Offer | null
}

export function MatchModal({ isOpen, onClose, offer }: MatchModalProps) {
  if (!isOpen || !offer) return null

  const handleStartChat = async () => {
    onClose()
    window.location.href = `/chat/${offer.matchId || offer.id}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-10 h-10 text-white fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">É um Match!</h2>
          <p className="text-gray-600">
            Sua proposta foi aceita por <span className="font-semibold">{offer.company}</span>
          </p>
          {offer.matchId && (
            <p className="text-xs text-gray-400 mt-2">
              Match ID: {offer.matchId}
            </p>
          )}
        </div>

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
                  {offer.company.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-600">{offer.company}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartChat}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Iniciar Conversa
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
          >
            Continuar Navegando
          </button>
        </div>
      </div>
    </div>
  )
}

export function MatchModalContainer() {
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedOffer, setMatchedOffer] = useState<Offer | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Verifica se há match pendente do login
    const checkPendingMatch = () => {
      const pendingMatch = localStorage.getItem("pendingMatch")
      if (pendingMatch) {
        try {
          const matchData = JSON.parse(pendingMatch)
          setMatchedOffer(matchData)
          setShowMatchModal(true)

          // Remove do localStorage após exibir
          localStorage.removeItem("pendingMatch")

          // Marca como notificado no backend
          const user = localStorage.getItem("user")
          if (user) {
            const userData = JSON.parse(user)
            setUserId(userData.id)
            fetch("/api/proposal-match-unique", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                proposalId: matchData.id,
                userId: userData.id,
              }),
            })
          }
        } catch (error) {
          console.error("Erro ao processar match pendente:", error)
          localStorage.removeItem("pendingMatch")
        }
      }
    }

    // Verifica imediatamente
    checkPendingMatch()

    // Escuta mudanças no localStorage (para quando fizer login)
    const handleStorageChange = () => {
      checkPendingMatch()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (showMatchModal && matchedOffer && userId) {
      fetch("/api/proposal-match-unique", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: matchedOffer.id, userId }),
      })
    }
  }, [showMatchModal, matchedOffer, userId])

  useEffect(() => {
    // Busca matches aceitos e não notificados para o usuário logado
    const fetchPendingMatch = async () => {
      const user = localStorage.getItem("user")
      if (!user) return
      const userData = JSON.parse(user)
      setUserId(userData.id)
      try {
        const res = await fetch(`/api/proposals-accepted?userId=${userData.id}`)
        const data: Array<{
          id: string
          residueData?: { companyName?: string }
          notifiedUserIds?: string[]
        }> = await res.json()
        // Encontra o primeiro match não notificado
        const notNotified = data.find(
          (proposal) =>
            !proposal.notifiedUserIds || !proposal.notifiedUserIds.includes(userData.id)
        )
        if (notNotified) {
          setMatchedOffer({
            id: notNotified.id,
            company: notNotified.residueData?.companyName || "Empresa",
            matchId: notNotified.id,
          })
          setShowMatchModal(true)
        }
      } catch {
        // Silencie erros para não travar a experiência do usuário
      }
    }

    fetchPendingMatch()
  }, [])

  const handleCloseModal = () => {
    setShowMatchModal(false)
    setMatchedOffer(null)
  }

  return (
    <MatchModal
      isOpen={showMatchModal}
      onClose={handleCloseModal}
      offer={matchedOffer}
    />
  )
}