import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"

export async function PATCH(req: NextRequest) {
  try {
    const { proposalId, userId } = await req.json()
    if (!proposalId || !userId) {
      return NextResponse.json({ error: "proposalId e userId obrigatórios." }, { status: 400 })
    }

    // Atualiza notifiedUserIds em proposalAccepted
    const acceptedRef = doc(db, "proposalAccepted", proposalId)
    const acceptedSnap = await getDoc(acceptedRef)
    if (acceptedSnap.exists()) {
      await updateDoc(acceptedRef, {
        notifiedUserIds: arrayUnion(userId),
      })
      return NextResponse.json({ message: "Usuário marcado como notificado para este match (proposalAccepted)." })
    }

    return NextResponse.json({ error: "Proposta não encontrada em proposalAccepted." }, { status: 404 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar match único." }, { status: 500 })
  }
}