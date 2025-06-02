import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { doc, updateDoc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { v4 as uuidv4 } from 'uuid' // Você precisa instalar: npm install uuid @types/uuid

export async function PATCH(req: NextRequest) {
  try {
    const { proposalId } = await req.json()
    if (!proposalId) {
      return NextResponse.json({ error: "proposalId obrigatório." }, { status: 400 })
    }

    // Atualiza statusA para true
    await updateDoc(doc(db, "proposals", proposalId), { statusA: true })

    // Busca a proposta atualizada
    const proposalDoc = await getDoc(doc(db, "proposals", proposalId))
    if (proposalDoc.exists()) {
      const data = proposalDoc.data()
      
      // Gera um ID único para o match
      const matchId = uuidv4()
      
      // Cria o objeto do match com ID único
      const matchData = {
        ...data,
        matchId, // ID único do match
        notifiedUserIds: data.notifiedUserIds || [],
        acceptedAt: new Date(),
        status: 'matched' // Status para indicar que é um match ativo
      }
      
      // Salva na collection proposalAccepted usando o proposalId como document ID
      await setDoc(doc(db, "proposalAccepted", proposalId), matchData)
      
      // Remove da collection proposals
      await deleteDoc(doc(db, "proposals", proposalId))
      
      return NextResponse.json({ 
        message: "Proposta aceita e match criado com sucesso!",
        matchId,
        proposalId 
      })
    }

    return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao aceitar proposta." }, { status: 500 })
  }
}

