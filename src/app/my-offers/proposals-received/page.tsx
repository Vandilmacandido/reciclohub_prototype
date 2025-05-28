"use client"
import { useEffect, useState } from "react"
import { Check, X, Mail } from "lucide-react"
import { MatchModal } from "@/app/modals/match"

interface Proposal {
  id: string
  residueData?: {
    descricao?: string
  }
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
  // adicione outros campos conforme necessário
}

export default function ProposalsReceivedPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedOffer, setMatchedOffer] = useState<ProposalAccepted | null>(null)
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  useEffect(() => {
    if (!userId) return
    fetch(`/api/received-proposal?userId=${userId}`)
      .then(res => res.json())
      .then((data: Proposal[]) => {
        setProposals(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Mail className="w-6 h-6 text-teal-600" />
          Propostas Recebidas
        </h1>
        {loading && (
          <div className="text-center text-gray-500 py-12">Carregando...</div>
        )}
        {!loading && proposals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta recebida</h3>
            <p className="text-gray-600">Aguarde, em breve você receberá propostas para seus resíduos.</p>
          </div>
        )}
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Proposta para: <span className="text-teal-700">{proposal.residueData?.descricao || "Resíduo"}</span>
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Mensagem:</span> {proposal.proposalData?.message || "-"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Quantidade:</span> {proposal.proposalData?.quantity || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Preço:</span> {proposal.proposalData?.price || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Frequência:</span> {proposal.proposalData?.frequency || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Transporte:</span> {proposal.proposalData?.transportType || "-"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(proposal.id)}
                  className="flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition"
                >
                  <Check className="w-4 h-4" /> Aceitar
                </button>
                <button
                  onClick={() => handleReject(proposal.id)}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4" /> Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          offer={matchedOffer ? { id: matchedOffer.id, company: "Empresa Desconhecida" } : null}
        />
      </div>
    </div>
  )
}