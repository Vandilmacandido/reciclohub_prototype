import { db } from "@/config/firebase.config"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
  try {
    const { residueId, userId } = await req.json()

    if (!residueId || !userId) {
      return NextResponse.json({ error: "residueId e userId são obrigatórios." }, { status: 400 })
    }

    const residueRef = doc(db, "residues", residueId)
    const residueSnap = await getDoc(residueRef)

    if (!residueSnap.exists()) {
      return NextResponse.json({ error: "Resíduo não encontrado." }, { status: 404 })
    }

    const residue = residueSnap.data()
    if (residue.userId !== userId) {
      return NextResponse.json({ error: "Você não tem permissão para excluir este resíduo." }, { status: 403 })
    }

    await deleteDoc(residueRef)
    return NextResponse.json({ message: "Resíduo excluído com sucesso!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao excluir resíduo." }, { status: 500 })
  }
}