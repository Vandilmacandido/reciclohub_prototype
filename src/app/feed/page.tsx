"use client"
import { useState, useEffect } from "react"
import { MapPin, Calendar, Truck, Heart, X, Search } from "lucide-react"
import Link from "next/link"
import { ProposalModal } from "../modals/proposal"
import { MatchModal } from "../modals/match"
import { useRouter } from "next/navigation"

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [rejectedOffers, setRejectedOffers] = useState<string[]>([])
  const [wasteOffers, setWasteOffers] = useState<any[]>([])
  const router = useRouter()

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
    "Toritama", // Apenas uma vez!
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

  const filteredOffers = wasteOffers.filter((offer) => {
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

  const handleProposal = (offer: any) => {
    setSelectedOffer(offer)
    setShowProposalModal(true)
  }

  const handleReject = (offerId: string) => {
    setRejectedOffers((prev) => [...prev, offerId])
  }

  const handleProposalSubmit = () => {
    setShowProposalModal(false)
    setTimeout(() => {
      setShowMatchModal(true)
    }, 1000)
  }

  const handleMatchClose = () => {
    setShowMatchModal(false)
    if (selectedOffer) {
      setRejectedOffers((prev) => [...prev, selectedOffer.id])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/feed" className="text-2xl font-bold">
              RECICLOHUB
            </Link>
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/feed" className="hover:text-teal-200 transition-colors font-medium">
                Feed
              </Link>
              <Link href="/residues/register" className="hover:text-teal-200 transition-colors">
                Publicar Oferta
              </Link>
              <Link href="/my-offers" className="hover:text-teal-200 transition-colors">
                Minhas Ofertas
              </Link>
              <Link href="/chat" className="hover:text-teal-200 transition-colors">
                Chat
              </Link>
              {/* Botão de logout */}
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-white text-teal-700 rounded hover:bg-teal-50 font-medium transition"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por empresa ou material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border border-gray-300 h-12 rounded w-full"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="bg-white border border-gray-300 h-12 rounded w-full px-3"
            >
              <option value="">Cidade</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Waste Offers Grid */}
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Imagem do resíduo */}
                <div className="w-full md:w-48 h-40 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {offer.imagens && offer.imagens.length > 0 ? (
                    <img src={offer.imagens[0]} alt="Resíduo" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-400">Sem imagem</span>
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{offer.companyName || "Empresa"}</h3>
                      <p className="text-gray-600 mb-3">
                        {offer.descricao}
                        <button className="text-teal-600 hover:text-teal-700 font-medium underline">Ver mais.</button>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Preço Estimado:</p>
                      <p className="text-xl font-bold text-gray-900">{offer.preco || "Sob consulta"}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>Localização: {offer.city} - {offer.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span>Disponibilidade: {offer.disponibilidade}</span>
                    </div>
                    {/* Adapte outros campos conforme necessário */}
                  </div>
                  {/* Match Actions */}
                  <div className="flex justify-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => handleReject(offer.id)}
                      className="w-16 h-16 rounded-full border border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 flex items-center justify-center"
                    >
                      <X className="w-8 h-8" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProposal(offer)}
                      className="w-16 h-16 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center"
                    >
                      <Heart className="w-8 h-8" />
                    </button>
                  </div>
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
              <Link href="/residuos/cadastrar" className="text-teal-600 hover:text-teal-700 underline">
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
        offer={selectedOffer}
      />

      <MatchModal isOpen={showMatchModal} onClose={handleMatchClose} offer={selectedOffer} />
    </div>
  )
}