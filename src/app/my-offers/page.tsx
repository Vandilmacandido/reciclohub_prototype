"use client"
import { useEffect, useState } from "react"
import { Trash2, Pencil, Plus, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface MyOffer {
  id: string
  tipoResiduo: string
  descricao: string
  quantidade: number
  unidade: string
  condicoes: string
  disponibilidade: string
  preco?: string
  imagens: { id: string; url: string }[]
  empresa: string
  propostas: number
  propostasPendentes: number
}

export default function MyOffersPage() {
  const [offers, setOffers] = useState<MyOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadMyOffers()
  }, [])

  const loadMyOffers = async () => {
    try {
      setError(null)
      const empresaId = localStorage.getItem("empresaId")
      if (!empresaId) {
        setError("ID da empresa não encontrado. Faça login novamente.")
        setOffers([])
        setLoading(false)
        return
      }

      console.log("Fazendo requisição para empresaId:", empresaId)
      const response = await fetch(`/actions/api/residues/my-residues?empresaId=${empresaId}`)

      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Response data received, processing...")

      // Check if data is empty object
      if (typeof data === 'object' && Object.keys(data).length === 0) {
        console.warn("Received empty object from API")
        setError("A API retornou uma resposta vazia. Verifique se o endpoint está funcionando corretamente.")
        setOffers([])
        return
      }

      if (data.success && Array.isArray(data.data)) {
        // Processar as ofertas para validar imagens
        const processedOffers = data.data.map((offer: MyOffer) => ({
          ...offer,
          imagens: offer.imagens.filter(img => {
            // Filtrar imagens válidas
            if (!img.url || img.url.trim() === '') {
              console.warn(`Imagem vazia encontrada no resíduo ${offer.id}`)
              return false
            }

            // Verificar se é base64 válido
            if (img.url.startsWith('data:image/')) {
              const base64Part = img.url.split(',')[1]
              if (!base64Part || base64Part.length < 100) {
                console.warn(`Base64 muito curto no resíduo ${offer.id}:`, img.url.substring(0, 100))
                return false
              }
            }

            return true
          })
        }))

        console.log(`✅ Processadas ${processedOffers.length} ofertas com imagens válidas`)
        setOffers(processedOffers)
      } else if (Array.isArray(data)) {
        console.log("Data is directly an array, using as offers")
        setOffers(data)
      } else {
        const errorMessage = data.error || data.message || `Formato de resposta inesperado.`
        console.error("Erro ao carregar ofertas:", errorMessage)
        setError(errorMessage)
        setOffers([])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro de conexão"
      console.error("Erro ao carregar ofertas:", error)
      setError(`Erro de conexão: ${errorMessage}`)
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (offerId: string) => {
    const empresaId = localStorage.getItem("empresaId")
    if (!empresaId) return

    if (!window.confirm("Tem certeza que deseja excluir este resíduo?")) return

    setDeletingId(offerId)

    try {
      const response = await fetch("/actions/api/residues/delete-residue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residueId: offerId, empresaId }),
      })

      if (response.ok) {
        setOffers(prev => prev.filter(o => o.id !== offerId))
        alert("Resíduo excluído com sucesso!")
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao excluir resíduo.")
      }
    } catch (error) {
      console.error("Erro ao excluir resíduo:", error)
      alert("Erro ao excluir resíduo.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (offerId: string) => {
    router.push(`/edit-residues/${offerId}`)
  }

  const handleViewProposals = (offerId: string) => {
    router.push(`/proposals/received?residueId=${offerId}`)
  }

  const formatPrice = (preco?: string, disponibilidade?: string) => {
    if (disponibilidade === "doacao") return "Gratuito"
    if (disponibilidade === "retirada") return "Retirada no Local"
    return preco ? `R$ ${preco}` : "Sob consulta"
  }

  const getAvailabilityColor = (disponibilidade: string) => {
    switch (disponibilidade) {
      case "venda":
        return "text-green-600 bg-green-50"
      case "doacao":
        return "text-blue-600 bg-blue-50"
      case "retirada":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getAvailabilityText = (disponibilidade: string) => {
    switch (disponibilidade) {
      case "venda":
        return "À venda"
      case "doacao":
        return "Doação"
      case "retirada":
        return "Retirada"
      default:
        return disponibilidade
    }
  }
  // Componente de imagem com fallback melhorado
  const ImageWithFallback = ({ offer }: { offer: MyOffer }) => {
    const [imageError, setImageError] = useState(false)

    const hasValidImage = offer.imagens && offer.imagens.length > 0 && offer.imagens[0].url

    if (!hasValidImage || imageError) {
      return (
        <div className="text-gray-400 text-center p-4 w-full h-full flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">📦</div>
          <span className="text-sm">
            {imageError ? "Erro ao carregar imagem" : "Sem imagem"}
          </span>
        </div>
      )
    }

    const imageUrl = offer.imagens[0].url

    // Trocar para <img> puro para depuração
    return (
      <Image
        src={imageUrl}
        alt={offer.tipoResiduo}
        width={400}
        height={160}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        onLoadingComplete={() => {
          console.log(`✅ Imagem carregada para resíduo ${offer.id}`)
        }}
        onError={() => {
          console.error(`❌ Erro ao carregar imagem do resíduo ${offer.id}:`, {
            url: imageUrl ? imageUrl.substring(0, 100) + '...' : 'URL não disponível',
            urlLength: imageUrl ? imageUrl.length : 0,
            hasImages: offer.imagens ? offer.imagens.length : 0
          })
          setImageError(true)
        }}
        loading="lazy"
        unoptimized={imageUrl.startsWith('data:image/')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Minhas Ofertas</h1>
            <p className="text-gray-600">
              Gerencie seus resíduos cadastrados e visualize propostas recebidas
            </p>
          </div>
          <button
            onClick={() => router.push("/residues/register")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5" />
            Nova Oferta
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar ofertas
            </h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={loadMyOffers}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && offers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma oferta cadastrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece publicando sua primeira oferta de resíduo
            </p>
            <button
              onClick={() => router.push("/residues/register")}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Publicar Primeira Oferta
            </button>
          </div>
        )}

        {/* Offers Grid */}
        {!loading && !error && offers.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {offers.length} {offers.length === 1 ? 'oferta cadastrada' : 'ofertas cadastradas'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden transition hover:shadow-md hover:border-teal-200"
                  style={{ minHeight: 380 }}
                >
                  {/* Image */}
                  <div className="relative w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-2xl">
                    <ImageWithFallback offer={offer} />

                    {/* Edit button */}
                    <button
                      onClick={() => handleEdit(offer.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 border border-teal-500 transition"
                      title="Editar resíduo"
                    >
                      <Pencil className="w-4 h-4 text-teal-600" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between p-5">
                    <div>
                      {/* Title and availability */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                          {offer.tipoResiduo}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(offer.disponibilidade)}`}>
                          {getAvailabilityText(offer.disponibilidade)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {offer.descricao}
                      </p>

                      {/* Quantity and condition */}
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Quantidade:</span>
                          <span className="font-medium">{offer.quantidade} {offer.unidade}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Condições:</span>
                          <span className="font-medium line-clamp-1">{offer.condicoes}</span>
                        </div>
                      </div>

                      {/* Image count indicator */}
                      {offer.imagens && offer.imagens.length > 1 && (
                        <div className="flex items-center gap-1 mb-3">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            +{offer.imagens.length - 1} imagem{offer.imagens.length > 2 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Proposals counter */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {offer.propostas} {offer.propostas === 1 ? 'proposta total' : 'propostas totais'}
                          </span>
                        </div>
                        {offer.propostasPendentes > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm font-medium text-yellow-600">
                              {offer.propostasPendentes} pendente{offer.propostasPendentes > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="space-y-3">
                      {/* Price */}
                      <div className="text-center">
                        <span className="text-teal-600 font-bold text-lg">
                          {formatPrice(offer.preco, offer.disponibilidade)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProposals(offer.id)}
                          className={`flex-1 text-white text-sm font-medium rounded-lg px-3 py-2 transition flex items-center justify-center gap-1 relative ${offer.propostasPendentes > 0
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                          <Eye className="w-4 h-4" />
                          Ver Propostas
                          {offer.propostasPendentes > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {offer.propostasPendentes}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          disabled={deletingId === offer.id}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-3 py-2 transition"
                          title="Excluir resíduo"
                        >
                          {deletingId === offer.id ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}