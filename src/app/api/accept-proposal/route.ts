import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { doc, updateDoc, getDoc, setDoc, deleteDoc } from "firebase/firestore" // removido addDoc, collection

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
      // Copia para proposalAccepted (mantendo notifiedUserIds se existir)
      await setDoc(doc(db, "proposalAccepted", proposalId), {
        ...data,
        notifiedUserIds: data.notifiedUserIds || [],
        acceptedAt: new Date(),
      })
      await deleteDoc(doc(db, "proposals", proposalId))
    }

    // Após aceitar a proposta:
    await fetch("/api/accept-proposal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId }),
    })
    refetchMatches() // função que faz o fetch em /api/proposals-accepted
    // O estado showMatchModal será atualizado e o modal aparecerá imediatamente

    return NextResponse.json({ message: "Proposta aceita e enviada para proposalAccepted!" })
  } catch (error) {
    console.error(error) // agora o error é usado
    return NextResponse.json({ error: "Erro ao aceitar proposta." }, { status: 500 })
  }
}

function refetchMatches() {
  throw new Error("Function not implemented.")
}

// ...dentro do componente onde o userA aceita a proposta...
// Adicione as funções de atualização de estado como parâmetros

