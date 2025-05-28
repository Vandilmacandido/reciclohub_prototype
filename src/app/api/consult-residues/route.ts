import { db } from "@/config/firebase.config"
import { collection, getDocs } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const snapshot = await getDocs(collection(db, "residues"))
    const residues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    return NextResponse.json(residues)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao consultar resíduos." }, { status: 500 })
  }
}