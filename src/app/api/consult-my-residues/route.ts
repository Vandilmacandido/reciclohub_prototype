import { db } from "@/config/firebase.config"
import { collection, getDocs, query, where } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Pega o userId da query string
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId não informado." }, { status: 400 })
    }

    // Busca resíduos cadastrados pelo usuário logado
    const residuesQuery = query(collection(db, "residues"), where("userId", "==", userId))
    const snapshot = await getDocs(residuesQuery)
    const residues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(residues)
  } catch (error) {
    console.error(error) // agora o error é usado
    return NextResponse.json({ error: "Erro ao consultar resíduos do usuário." }, { status: 500 })
  }
}