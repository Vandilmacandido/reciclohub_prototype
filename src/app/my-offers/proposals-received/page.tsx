"use client"
import { useEffect, useState } from "react"
import { Check, X, Mail } from "lucide-react"
import { MatchModal } from "@/app/modals/match"

interface Proposal {
  id: string
  residueData?: { descricao?: string }
  proposalData?: {
    message?: string
    quantity?: string | number
    price?: string | number
    frequency?: string
    transportType?: string
  }
  notifiedUserIds?: string[]
}

interface ProposalAccepted {
  id: string
  notifiedUserIds?: string[]
}

export default function ProposalsReceivedPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedOffer, setMatchedOffer] = useState<ProposalAccepted | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [checkedUserId, setCheckedUserId] = useState(false)

  // Garante que userId só é setado no client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"))
      setCheckedUserId(true)
    }
  }, [])

  useEffect(() => {
    if (!checkedUserId) return
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/received-proposal?userId=${userId}`)
      .then(res => res.json())
      .then((data: Proposal[]) => {
        setProposals(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId, checkedUserId])

  // Função para buscar matches aceitos e exibir o modal se necessário
  const refetchMatches = async () => {
    if (!userId) return
    const res = await fetch(`/api/proposals-accepted?userId=${userId}`)
    const data: ProposalAccepted[] = await res.json()
    const notNotified = data.find(
      (proposal) =>
        !proposal.notifiedUserIds || !proposal.notifiedUserIds.includes(userId)
    )
    if (notNotified) {
      setMatchedOffer(notNotified)
      setShowMatchModal(true)
    }
  }

  const handleAccept = async (proposalId: string) => {
    await fetch("/api/accept-proposal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId }),
    })
    setProposals(prev => prev.filter(p => p.id !== proposalId))
    await refetchMatches()
  }

  const handleReject = async (proposalId: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId))
  }

  // Notifica o backend assim que o modal abrir
  useEffect(() => {
    if (showMatchModal && matchedOffer && userId) {
      fetch("/api/proposal-match-unique", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: matchedOffer.id, userId }),
      })
    }
  }, [showMatchModal, matchedOffer, userId])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Propostas Recebidas
          </h1>
        </div>

        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Proposta para: <span className="text-teal-700">{proposal.residueData?.descricao || "Resíduo"}</span>
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Mensagem:</span> {proposal.proposalData?.message || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Quantidade:</span>
                      <br />
                      {proposal.proposalData?.quantity || "-"}
                    </div>
                    <div>
                      <span className="font-medium">Preço:</span>
                      <br />
                      {proposal.proposalData?.price || "-"}
                    </div>
                    <div>
                      <span className="font-medium">Frequência:</span>
                      <br />
                      {proposal.proposalData?.frequency || "-"}
                    </div>
                    <div>
                      <span className="font-medium">Transporte:</span>
                      <br />
                      {proposal.proposalData?.transportType || "-"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAccept(proposal.id)}
                      className="flex items-center px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm transition"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aceitar
                    </button>
                    <button
                      onClick={() => handleReject(proposal.id)}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm transition"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Recusar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        )}

        {!loading && proposals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Não há propostas recebidas no momento</h3>
            <p className="text-gray-600 mb-4">Aguarde, em breve você receberá propostas para seus resíduos.</p>
          </div>
        )}

        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          offer={matchedOffer ? { id: matchedOffer.id, company: "Empresa Desconhecida" } : null}
        />
      </div>
    </div>
  )
}