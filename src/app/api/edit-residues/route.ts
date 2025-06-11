import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function PATCH(req: NextRequest) {
  try {
    const { residueId, userId, updateData } = await req.json()

    if (!residueId || !userId || !updateData) {
      return NextResponse.json({ error: "residueId, userId e updateData são obrigatórios." }, { status: 400 })
    }

    // Busca o resíduo pelo ID
    const residueRef = doc(db, "residues", residueId)
    const residueSnap = await getDoc(residueRef)

    if (!residueSnap.exists()) {
      return NextResponse.json({ error: "Resíduo não encontrado." }, { status: 404 })
    }

    const residue = residueSnap.data()
    // Verifica se o userId do resíduo é igual ao userId do request
    if (residue.userId !== userId) {
      return NextResponse.json({ error: "Você não tem permissão para editar este resíduo." }, { status: 403 })
    }

    // Atualiza o resíduo
    await updateDoc(residueRef, updateData)

    return NextResponse.json({ message: "Resíduo atualizado com sucesso!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao editar resíduo." }, { status: 500 })
  }
}