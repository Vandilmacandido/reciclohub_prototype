import io from "socket.io-client"
import { useEffect, useRef } from "react"

export interface Message {
  id: number
  sender: "me" | "other"
  content: string
  timestamp: string
  matchId?: string
}

export function useChatSocket(
  matchId: string | null,
  onMessage: (msg: Message) => void,
  allMatchIds?: string[]
) {
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io({ path: "/api/socketio" })
    }
    const socket = socketRef.current
    // Join em todas as rooms dos matches
    if (allMatchIds && allMatchIds.length > 0) {
      allMatchIds.forEach(id => socket.emit("join", id))
    } else if (matchId) {
      socket.emit("join", matchId)
    }
    socket.on("message", onMessage)
    return () => {
      socket.off("message", onMessage)
      if (allMatchIds && allMatchIds.length > 0) {
        allMatchIds.forEach(id => socket.emit("leave", id))
      } else if (matchId) {
        socket.emit("leave", matchId)
      }
    }
  }, [matchId, onMessage, allMatchIds])

  function sendMessage(message: Message) {
    if (socketRef.current && matchId) {
      socketRef.current.emit("message", { matchId, message })
    }
  }

  return { sendMessage }
}
