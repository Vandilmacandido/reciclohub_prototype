import { db } from "@/config/firebase.config"
import { collection, getDocs, query, where } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) {
      return NextResponse.json([], { status: 200 })
    }

    // Busca todas as propostas onde o resíduo foi cadastrado pelo usuário logado
    const proposalsQuery = query(
      collection(db, "proposals"),
      where("userAId", "==", userId)
    )
    const snapshot = await getDocs(proposalsQuery)
    const proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    return NextResponse.json(proposals)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar propostas recebidas." }, { status: 500 })
  }
}