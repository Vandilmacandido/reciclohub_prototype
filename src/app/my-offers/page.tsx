"use client"
import { useEffect, useState } from "react"
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"

interface Offer {
  id: string
  imagens?: string[]
  tipoResiduo?: string
  descricao?: string
  quantidade?: number
  unidade?: string
  preco?: string
  status?: string
  createdAt?: { toDate?: () => string } | string
  // Adicione outros campos conforme necessário
}

export default function MinhasOfertasPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
    if (!userId) {
      setOffers([])
      setLoading(false)
      return
    }
    fetch(`/api/consult-my-residues?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setOffers(data)
        setLoading(false)
      })
      .catch(() => {
        setOffers([])
        setLoading(false)
      })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-green-100 text-green-800"
      case "Pausada":
        return "bg-yellow-100 text-yellow-800"
      case "Finalizada":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Minhas Ofertas</h1>
          {offers.length > 0 && (
            <a
              href="/residues/register"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-medium transition"
            >
              Nova Oferta
            </a>
          )}
        </div>

        <div className="space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-24 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                  {offer.imagens && offer.imagens.length > 0 ? (
                    <Image
                      src={offer.imagens[0]}
                      alt="Resíduo"
                      width={128}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 flex items-center justify-center h-full">Sem imagem</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{offer.tipoResiduo || "Resíduo"}</h3>
                      <p className="text-gray-600 text-sm mb-2">{offer.descricao}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(offer.status || "Ativa")}`}>
                        {offer.status || "Ativa"}
                      </span>
                      <button className="p-2 rounded hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Quantidade:</span>
                      <br />
                      {offer.quantidade} {offer.unidade}
                    </div>
                    <div>
                      <span className="font-medium">Preço:</span>
                      <br />
                      {offer.preco || "Sob consulta"}
                    </div>
                    <div>
                      <span className="font-medium">Interessados:</span>
                      <br />
                      {/* Adapte conforme implementação futura */}
                      0 empresas
                    </div>
                    <div>
                      <span className="font-medium">Criada em:</span>
                      <br />
                      {offer.createdAt && typeof offer.createdAt === "object" && "toDate" in offer.createdAt
                        ? new Date((offer.createdAt as { toDate: () => string }).toDate()).toLocaleDateString()
                        : (offer.createdAt && typeof offer.createdAt === "string"
                          ? new Date(offer.createdAt).toLocaleDateString()
                          : "-")}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </a>
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
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

        {!loading && offers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oferta cadastrada</h3>
            <p className="text-gray-600 mb-4">Comece publicando sua primeira oferta de resíduo</p>
            <a
              href="/residues/register"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-medium transition"
            >
              Publicar Primeira Oferta
            </a>
          </div>
        )}
      </div>
    </div>
  )
}