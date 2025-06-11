import { db } from "@/config/firebase.config"
import { doc, getDoc } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID não informado." }, { status: 400 })
    }

    const residueRef = doc(db, "residues", id)
    const residueSnap = await getDoc(residueRef)
    if (!residueSnap.exists()) {
      return NextResponse.json({ error: "Resíduo não encontrado." }, { status: 404 })
    }

    return NextResponse.json({ id: residueSnap.id, ...residueSnap.data() })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar resíduo." }, { status: 500 })
  }
}