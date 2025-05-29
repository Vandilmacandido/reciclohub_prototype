import { db } from "@/config/firebase.config"
import { collection, getDocs, query, where } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId não informado." }, { status: 400 })
    }

    // Busca propostas aceitas onde o userAId OU userBId é igual ao userId
    const userAQuery = query(
      collection(db, "proposalAccepted"),
      where("userAId", "==", userId)
    )
    const userBQuery = query(
      collection(db, "proposalAccepted"),
      where("userBId", "==", userId)
    )
    const [userAResult, userBResult] = await Promise.all([
      getDocs(userAQuery),
      getDocs(userBQuery)
    ])

    // Junta e remove duplicados pelo id
    const proposalsMap = new Map()
    userAResult.docs.forEach(doc => proposalsMap.set(doc.id, { id: doc.id, ...doc.data() }))
    userBResult.docs.forEach(doc => proposalsMap.set(doc.id, { id: doc.id, ...doc.data() }))
    const proposals = Array.from(proposalsMap.values())

    return NextResponse.json(proposals)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar propostas aceitas." }, { status: 500 })
  }
}