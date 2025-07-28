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
    window.location.href = `/chat`;
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
  const [empresaId, setEmpresaId] = useState<number | null>(null)

  // Função para buscar e exibir match imediatamente
  const checkAndShowMatch = async () => {
    const empresaIdStr = localStorage.getItem("empresaId")
    if (!empresaIdStr) return
    const empresaIdNum = parseInt(empresaIdStr)
    setEmpresaId(empresaIdNum)
    try {
      const res = await fetch(`/api/proposals-accepted?empresaId=${empresaIdNum}`)
      const data: Array<{
        id: string
        residueData?: { companyName?: string }
        notifiedEmpresaIds?: number[]
      }> = await res.json()
      const notNotified = data.find(
        (proposal) =>
          !proposal.notifiedEmpresaIds || !proposal.notifiedEmpresaIds.includes(empresaIdNum)
      )
      if (notNotified) {
        setMatchedOffer({
          id: notNotified.id,
          company: notNotified.residueData?.companyName || "Empresa",
          matchId: notNotified.id,
        })
        setShowMatchModal(true)
      } else {
        setMatchedOffer(null)
        setShowMatchModal(false)
      }
    } catch {
      setMatchedOffer(null)
      setShowMatchModal(false)
    }
  }

  useEffect(() => {
    // Verifica imediatamente ao montar
    checkAndShowMatch()
    // Escuta evento customizado para checar match após aceite
    const handler = () => checkAndShowMatch()
    window.addEventListener('check-match-modal', handler)
    return () => {
      window.removeEventListener('check-match-modal', handler)
    }
  }, [])

  useEffect(() => {
    if (showMatchModal && matchedOffer && empresaId) {
      fetch("/api/proposal-match-unique", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: matchedOffer.id, empresaId }),
      })
    }
  }, [showMatchModal, matchedOffer, empresaId])

  useEffect(() => {
    // Busca matches aceitos e não notificados para a empresa logada
    const fetchPendingMatch = async () => {
      const empresaIdStr = localStorage.getItem("empresaId")
      if (!empresaIdStr) return
      const empresaIdNum = parseInt(empresaIdStr)
      setEmpresaId(empresaIdNum)
      try {
        const res = await fetch(`/api/proposals-accepted?empresaId=${empresaIdNum}`)
        const data: Array<{
          id: string
          residueData?: { companyName?: string }
          notifiedEmpresaIds?: number[]
        }> = await res.json()
        // Encontra o primeiro match não notificado
        const notNotified = data.find(
          (proposal) =>
            !proposal.notifiedEmpresaIds || !proposal.notifiedEmpresaIds.includes(empresaIdNum)
        )
        if (notNotified) {
          setMatchedOffer({
            id: notNotified.id,
            company: notNotified.residueData?.companyName || "Empresa",
            matchId: notNotified.id,
          })
          setShowMatchModal(true)
        } else {
          // Não há match não visualizado, não exibe modal
          setMatchedOffer(null)
          setShowMatchModal(false)
        }
      } catch {
        // Silencie erros para não travar a experiência do usuário
        setMatchedOffer(null)
        setShowMatchModal(false)
      }
    }

    fetchPendingMatch()
  }, [])

  const handleCloseModal = () => {
    // Marca como visualizada ao fechar o modal
    if (matchedOffer && empresaId) {
      fetch("/api/proposal-match-unique", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: matchedOffer.id, empresaId }),
      })
    }
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