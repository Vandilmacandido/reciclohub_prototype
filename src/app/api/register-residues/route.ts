import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, getDoc, doc } from "firebase/firestore"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validação básica dos campos obrigatórios
    if (
      !data.tipoResiduo ||
      !data.descricao ||
      !data.quantidade ||
      !data.unidade ||
      !data.condicoes ||
      !data.disponibilidade ||
      !data.userId
    ) {
      return NextResponse.json({ error: "Dados obrigatórios faltando." }, { status: 400 })
    }

    // Busca o nome da empresa do usuário
    const userDoc = await getDoc(doc(db, "users", data.userId))
    const companyName = userDoc.exists() ? userDoc.data().companyName : "Empresa"

    // Cria o resíduo no Firestore, incluindo o nome da empresa
    const residueRef = await addDoc(collection(db, "residues"), {
      tipoResiduo: data.tipoResiduo,
      descricao: data.descricao,
      quantidade: data.quantidade,
      unidade: data.unidade,
      condicoes: data.condicoes,
      disponibilidade: data.disponibilidade,
      preco: data.preco || "",
      imagens: data.imagens || [],
      userId: data.userId,
      companyName, // Salva o nome da empresa
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Resíduo cadastrado com sucesso!", id: residueRef.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar resíduo." }, { status: 500 })
  }
}