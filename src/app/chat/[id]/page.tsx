"use client"
import { useState } from "react"
import { ArrowLeft, Send, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function ChatDetailPage() {
  const [message, setMessage] = useState("")

  // Mock data based on ID
  const chatData = {
    company: "Lavanderia XXXXX",
    wasteType: "Têxtil",
    avatar: "L",
  }

  const messages = [
    {
      id: 1,
      sender: "other",
      content: "Olá! Sua proposta foi aceita! Vamos conversar sobre os detalhes.",
      timestamp: "14:25",
    },
    {
      id: 2,
      sender: "me",
      content: "Ótimo! Quando podemos agendar a primeira coleta?",
      timestamp: "14:27",
    },
    {
      id: 3,
      sender: "other",
      content: "Que tal na próxima terça-feira pela manhã?",
      timestamp: "14:30",
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Enviando mensagem:", message)
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-2 rounded hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
            {chatData.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{chatData.company}</h3>
            <p className="text-sm text-gray-600">{chatData.wasteType}</p>
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
    </div>
  )
}