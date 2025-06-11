"use client"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { ProposalModal } from "../modals/proposal"
import { MatchModal } from "../modals/match"
import Image from "next/image"

// Defina um tipo para as ofertas
interface WasteOffer {
  id: string
  companyName?: string
  descricao?: string
  preco?: string
  imagens?: string[]
  city?: string
  state?: string
  disponibilidade?: string
  quantity?: number
  frequency?: string
  transportType?: string
  [key: string]: unknown
}

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedOffer, setSelectedOffer] = useState<WasteOffer | null>(null)
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [rejectedOffers, setRejectedOffers] = useState<string[]>([])
  const [wasteOffers, setWasteOffers] = useState<WasteOffer[]>([])

  // Carrega os resíduos do Firestore ao montar o componente
  useEffect(() => {
    fetch("/api/consult-residues")
      .then(res => res.json())
      .then(data => setWasteOffers(data))
      .catch(() => setWasteOffers([]))
  }, [])

  // Apenas cidades de Pernambuco (sem duplicatas)
  const locations = [
    "Todas as cidades",
    "Recife",
    "Olinda",
    "Jaboatão dos Guararapes",
    "Caruaru",
    "Petrolina",
    "Paulista",
    "Cabo de Santo Agostinho",
    "Camaragibe",
    "Garanhuns",
    "Vitória de Santo Antão",
    "Igarassu",
    "São Lourenço da Mata",
    "Abreu e Lima",
    "Arcoverde",
    "Serra Talhada",
    "Santa Cruz do Capibaribe",
    "Goiana",
    "Surubim",
    "Palmares",
    "Gravatá",
    "Pesqueira",
    "Belo Jardim",
    "Escada",
    "Ouricuri",
    "Carpina",
    "Araripina",
    "Limoeiro",
    "Barreiros",
    "Salgueiro",
    "Bezerros",
    "Afogados da Ingazeira",
    "São Bento do Una",
    "Timbaúba",
    "Custódia",
    "Buíque",
    "Bom Conselho",
    "Santa Maria da Boa Vista",
    "São José do Egito",
    "Ribeirão",
    "Trindade",
    "Águas Belas",
    "Flores",
    "Toritama",
    "Ipojuca",
    "Tabira",
    "Lajedo",
    "Itambé",
    "Pombos",
    "Moreilândia",
    "Petrolândia",
    "Cabrobó",
    "Exu",
    "Bodocó",
    "Santa Cruz",
    "Orobó",
    "Condado",
    "São Caetano",
    "Venturosa",
    "Santa Maria do Cambucá",
    "Itaíba",
    "Bonito",
    "Jataúba",
    "Gameleira",
    "São José do Belmonte",
    "Ipubi",
    "Outras cidades"
  ]

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const filteredOffers = wasteOffers.filter((offer) => {
    // Agora mostra todos os resíduos, inclusive os do usuário logado

    const matchesSearch =
      (offer.companyName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (offer.descricao?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesLocation =
      !selectedLocation ||
      selectedLocation === "Todas as cidades" ||
      (offer.city?.toLowerCase().includes(selectedLocation.toLowerCase()) && offer.state?.toLowerCase() === "pe")
    const notRejected = !rejectedOffers.includes(offer.id)
    return matchesSearch && matchesLocation && notRejected
  })

  const handleProposal = (offer: WasteOffer) => {
    setSelectedOffer(offer)
    setShowProposalModal(true)
  }

  const handleProposalSubmit = async () => {
    if (!selectedOffer) {
      console.error("Nenhuma oferta selecionada para proposta.")
      return
    }
    try {
      const data = {
        residueId: selectedOffer.id,  
        userBId: userId,
        proposalData: {
          quantity: selectedOffer.quantity,
          frequency: selectedOffer.frequency,
          price: selectedOffer.preco,
          message: selectedOffer.descricao,
          transportType: selectedOffer.transportType,
        },
      }
      const response = await fetch("/api/make-proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      console.log(response)

    } catch (error) {
      console.error("Erro ao enviar proposta:", error)
    }
  }

  const handleMatchClose = () => {
    setShowMatchModal(false)
    if (selectedOffer) {
      setRejectedOffers((prev) => [...prev, selectedOffer.id])
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Título da página */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por empresa ou material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border text-gray-400 border-gray-300 h-12 rounded w-full"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="bg-white border text-gray-400 border-gray-300 h-12 rounded w-full px-3"
            >
              <option value="">Cidade</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <h1 className="text-2xl pt-4 pb-4 font-bold text-gray-900 mb-4 md:mb-0">Resíduos Ofertados</h1>

        {/* Waste Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border-2 border-teal-500 rounded-2xl shadow-sm flex flex-col overflow-hidden transition hover:shadow-md"
              style={{ minHeight: 320 }}
            >
              {/* Imagem do resíduo */}
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-2xl">
                {offer.imagens && offer.imagens.length > 0 ? (
                  <Image
                    src={offer.imagens[0]}
                    alt="Resíduo"
                    width={400}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400">Sem imagem</span>
                )}
              </div>
              {/* Conteúdo */}
              <div className="flex-1 flex flex-col justify-between px-5 py-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{offer.descricao || "Resíduo"}</h3>
                  <div className="flex justify-between text-gray-400 text-sm mb-2">
                    <span>{offer.companyName || "Empresa"}</span>
                    <span>
                      {offer.quantity ? `${offer.quantity} kg disponíveis` : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-teal-600 font-bold text-base">
                    {offer.preco ? `R$ ${offer.preco}` : "Sob consulta"}
                  </span>
                  <button
                    className="bg-teal-600 cursor-pointer cursor-po hover:bg-teal-700 text-white text-xs font-semibold rounded-lg px-4 py-1 shadow transition"
                    onClick={() => handleProposal(offer)}
                  >
                    Fazer Proposta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oferta encontrada</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou{" "}
              <Link href="/residues/register" className="text-teal-600 hover:text-teal-700 underline">
                publique uma nova oferta
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        onSubmit={handleProposalSubmit}
        offer={selectedOffer ? {
          id: Number(selectedOffer.id),
          company: selectedOffer.companyName || "Empresa",
          wasteType: selectedOffer.descricao || "",
          quantity: selectedOffer.quantity ? String(selectedOffer.quantity) : "",
        } : null}
      />

      <MatchModal
        isOpen={showMatchModal}
        onClose={handleMatchClose}
        offer={selectedOffer ? {
          id: selectedOffer.id,
          company: selectedOffer.companyName || "Empresa",
        } : null}
      />
    </div>
  )
}