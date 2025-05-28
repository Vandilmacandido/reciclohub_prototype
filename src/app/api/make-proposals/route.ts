import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, getDoc, doc } from "firebase/firestore"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { residueId, userBId, proposalData } = data
    console.log('1')
    if (!residueId || !userBId || !proposalData) {
      return NextResponse.json({ error: "Dados obrigatórios faltando." }, { status: 400 })
    }
    console.log(residueId)

    // Busca snapshot do resíduo
    const residueDoc = await getDoc(doc(db, "residues", residueId))
    if (!residueDoc.exists()) {
        console.log('2')
      return NextResponse.json({ error: "Resíduo não encontrado." }, { status: 404 })
    }

    // Garante que userAId é o dono do resíduo
    const residueData = residueDoc.data()
    const userAId = residueData.userId

    // Cria proposta
    console.log('3')
    const proposalRef = await addDoc(collection(db, "proposals"), {
      residueId,
      userAId, // sempre o dono do resíduo
      userBId, // quem está propondo
      residueData,
      proposalData,
      statusA: false, // user A ainda não aceitou
      statusB: true,  // user B já aceitou (ele está propondo)
      createdAt: new Date(),
      notifiedUserIds: [], // <-- Adiciona o campo de notificação, vazio inicialmente
    })
    console.log(proposalRef)

    return NextResponse.json({ message: "Proposta enviada!", id: proposalRef.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao enviar proposta." }, { status: 500 })
  }
}