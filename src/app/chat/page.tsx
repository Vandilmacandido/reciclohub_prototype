"use client"
import { useState } from "react"
import { ArrowLeft, Send, MoreVertical, MessageCircle } from "lucide-react"
import Link from "next/link"

// Mock data for matches/chats
const matches = [
  {
    id: 1,
    company: "Lavanderia XXXXX",
    wasteType: "Têxtil",
    lastMessage: "Ótimo! Quando podemos agendar a coleta?",
    timestamp: "14:30",
    unread: 2,
    avatar: "L",
  },
  {
    id: 2,
    company: "Metalúrgica XYZ",
    wasteType: "Metal",
    lastMessage: "Perfeito, vamos finalizar os detalhes",
    timestamp: "Ontem",
    unread: 0,
    avatar: "M",
  },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  // Mock messages for selected chat
  const messages = [
    {
      id: 1,
      sender: "other",
      content: "Olá! Vi sua proposta para nossos resíduos têxteis.",
      timestamp: "14:25",
    },
    {
      id: 2,
      sender: "me",
      content: "Oi! Sim, temos interesse. Podemos coletar semanalmente.",
      timestamp: "14:27",
    },
    {
      id: 3,
      sender: "other",
      content: "Ótimo! Quando podemos agendar a coleta?",
      timestamp: "14:30",
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Enviando mensagem:", message)
      setMessage("")
    }
  }

  const selectedMatch = matches.find((m) => m.id === selectedChat)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/feed" className="text-2xl font-bold">
              RECICLOHUB
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/feed" className="hover:text-teal-200 transition-colors">
                Feed
              </Link>
              <Link href="/residues/register" className="hover:text-teal-200 transition-colors">
                Publicar Oferta
              </Link>
              <Link href="/minhas-ofertas" className="hover:text-teal-200 transition-colors">
                Minhas Ofertas
              </Link>
              <Link href="/negociacoes" className="hover:text-teal-200 transition-colors">
                Minhas Negociações
              </Link>
              <Link href="/chat" className="hover:text-teal-200 transition-colors font-medium">
                Chat
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex">
        {/* Chat List */}
        <div className={`w-full md:w-1/3 bg-white border-r ${selectedChat ? "hidden md:block" : ""}`}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
          </div>
          <div className="overflow-y-auto">
            {matches.map((match) => (
              <div
                key={match.id}
                onClick={() => setSelectedChat(match.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedChat === match.id ? "bg-teal-50 border-l-4 border-l-teal-600" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    {match.avatar}
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
            ))}
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
                    {selectedMatch.avatar}
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
                {messages.map((msg) => (
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