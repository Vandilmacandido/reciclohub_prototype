import { db } from "@/config/firebase.config"
import { collection, getDocs, query, where } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

interface ResidueData {
  // Adicione os campos relevantes conforme seu modelo
  [key: string]: unknown
}

interface ProposalData {
  // Adicione os campos relevantes conforme seu modelo
  [key: string]: unknown
}

interface ProposalAccepted {
  id: string
  residueId: string
  userAId: string
  userBId: string
  residueData: ResidueData
  proposalData: ProposalData
  statusA: boolean
  statusB: boolean
  createdAt: Date
  notifiedUserIds: string[]
  acceptedAt: Date
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId não informado." }, { status: 400 })
    }

    // Busca propostas aceitas onde o userAId OU userBId é igual ao userId
    const proposalsQuery = query(
      collection(db, "proposalAccepted"),
      where("notifiedUserIds", "array-contains-any", [userId])
    )
    const snapshot = await getDocs(proposalsQuery)
    const proposals: ProposalAccepted[] = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        residueId: data.residueId,
        userAId: data.userAId,
        userBId: data.userBId,
        residueData: data.residueData,
        proposalData: data.proposalData,
        statusA: data.statusA,
        statusB: data.statusB,
        createdAt: data.createdAt,
        notifiedUserIds: data.notifiedUserIds,
        acceptedAt: data.acceptedAt,
      }
    })

    return NextResponse.json(proposals)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar propostas aceitas." }, { status: 500 })
  }
}