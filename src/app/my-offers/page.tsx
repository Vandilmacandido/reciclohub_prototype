"use client"
import { useEffect, useState } from "react"
import { Trash2, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

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

  const handleDelete = async (offerId: string) => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
    if (!userId) return
    if (!window.confirm("Tem certeza que deseja excluir este resíduo?")) return
    setDeletingId(offerId)
    try {
      const res = await fetch("/api/delete-residue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residueId: offerId, userId }),
      })
      if (res.ok) {
        setOffers(prev => prev.filter(o => o.id !== offerId))
      } else {
        const err = await res.json()
        alert(err.error || "Erro ao excluir resíduo.")
      }
    } catch {
      alert("Erro ao excluir resíduo.")
    }
    setDeletingId(null)
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border-2 border-teal-500 rounded-2xl shadow-sm flex flex-col overflow-hidden transition hover:shadow-md relative"
              style={{ minHeight: 320 }}
            >
              {/* Imagem do resíduo */}
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-2xl relative">
                {offer.imagens && offer.imagens.length > 0 && typeof offer.imagens[0] === "string" && offer.imagens[0].startsWith("data:image") ? (
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
                {/* Ícone de edição */}
                <button
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 border border-teal-500"
                  title="Editar"
                  type="button"
                  onClick={() => router.push(`/edit-residues/${offer.id}`)}
                >
                  <Pencil className="w-5 h-5 cursor-pointer text-teal-600" />
                </button>
              </div>
              {/* Conteúdo */}
              <div className="flex-1 flex flex-col justify-between px-5 py-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{offer.descricao || "Resíduo"}</h3>
                  <div className="flex justify-between text-gray-400 text-sm mb-2">
                    <span>
                      {offer.quantidade ? `${offer.quantidade} kg disponíveis` : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-teal-600 font-bold text-base">
                    {offer.preco ? `R$ ${offer.preco}` : "Sob consulta"}
                  </span>
                  <button
                    className="bg-red-700 cursor-pointer hover:bg-red-800 text-white text-xs font-semibold rounded-lg px-4 py-1 shadow transition"
                    onClick={() => handleDelete(offer.id)}
                    disabled={deletingId === offer.id}
                  >
                    {deletingId === offer.id ? "Excluindo..." : "Excluir"}
                  </button>
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