"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Send, MoreVertical, MessageCircle } from "lucide-react"

// Types
interface Message {
  id: number
  sender: "me" | "other"
  content: string
  timestamp: string
}

interface Match {
  id: string
  company: string
  wasteType: string
  timestamp: string
  lastMessage: string
  unread: number
  avatar: string | null
  messages: Message[]
}

interface ProposalData {
  message?: string
}

interface ResidueData {
  companyName?: string
  descricao?: string
}

interface AcceptedAt {
  seconds?: number
}

interface ApiMatch {
  id: string
  userBId: string
  proposalData?: ProposalData
  residueData?: ResidueData
  acceptedAt?: AcceptedAt
}

// Mock function to simulate fetching data from the database
async function fetchMatches(userId: string): Promise<Match[]> {
  try {
    const response = await fetch(`/api/proposals-accepted?userId=${userId}`)
    const data: ApiMatch[] = await response.json()

    // Transforma os dados da API em dados compatíveis com o chat
    return data.map((match: ApiMatch, index: number) => ({
      id: match.id,
      company: match.residueData?.companyName || `Empresa ${index + 1}`,
      wasteType: match.residueData?.descricao || "Resíduo",
      timestamp: new Date(match.acceptedAt?.seconds ? match.acceptedAt.seconds * 1000 : Date.now()).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      lastMessage: match.proposalData?.message || "Proposta aceita! Vamos negociar?",
      unread: Math.floor(Math.random() * 3), // Mock de mensagens não lidas
      avatar: null,
      messages: [
        {
          id: 1,
          sender: (match.userBId === userId ? "me" : "other") as "me" | "other",
          content: match.proposalData?.message || "Olá! Tenho interesse no seu resíduo.",
          timestamp: new Date(match.acceptedAt?.seconds ? match.acceptedAt.seconds * 1000 : Date.now()).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        },
        {
          id: 2,
          sender: (match.userBId === userId ? "other" : "me") as "me" | "other", 
          content: "Proposta aceita! Vamos discutir os detalhes da coleta.",
          timestamp: new Date(Date.now() + 300000).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }
      ]
    }))
    .sort((a: Match, b: Match) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error("Erro ao buscar matches:", error)
    return []
  }
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [matches, setMatches] = useState<Match[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Pega o userId do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (user) {
        const userData = JSON.parse(user)
        setUserId(userData.id)
      }
    }
  }, [])

  // Busca os matches quando o userId estiver disponível
  useEffect(() => {
    if (userId) {
      setLoading(true)
      fetchMatches(userId)
        .then(setMatches)
        .finally(() => setLoading(false))
    }
  }, [userId])

  const handleSendMessage = () => {
    const selectedMatch = matches.find((m) => m.id === selectedChat)
    if (message.trim() && selectedMatch) {
      // Adiciona a nova mensagem ao match selecionado
      const newMessage: Message = {
        id: Date.now(),
        sender: "me",
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }

      setMatches(prev => prev.map(match => 
        match.id === selectedChat 
          ? { ...match, messages: [...match.messages, newMessage], lastMessage: message.trim() }
          : match
      ))
      
      setMessage("")
    }
  }

  const selectedMatch = matches.find((m) => m.id === selectedChat)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Carregando conversas...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex">
        {/* Chat List */}
        <div className={`w-full md:w-1/3 bg-white border-r ${selectedChat ? "hidden md:block" : ""}`}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
          </div>
          <div className="overflow-y-auto">
            {matches.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Nenhuma conversa encontrada</p>
                <p className="text-sm">Aceite algumas propostas para começar a conversar!</p>
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedChat(match.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat === match.id ? "bg-teal-50 border-l-4 border-l-teal-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {match.company[0]?.toUpperCase() || "E"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{match.company}</h3>
                        <span className="text-xs text-gray-500">{match.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                      <p className="text-xs text-teal-600">{match.wasteType}</p>
                    </div>
                    {match.unread > 0 && (
                      <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{match.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedChat ? "hidden md:flex" : ""}`}>
          {selectedChat && selectedMatch ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 rounded hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedMatch.company[0]?.toUpperCase() || "E"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedMatch.company}</h3>
                    <p className="text-sm text-gray-600">{selectedMatch.wasteType}</p>
                  </div>
                </div>
                <button className="p-2 rounded hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedMatch.messages.map((msg: Message) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "me" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-teal-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t p-4">
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="bg-teal-600 hover:bg-teal-700 text-white rounded px-4 py-2 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                <p className="text-gray-600">Escolha uma conversa para começar a negociar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}