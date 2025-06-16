import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, getDoc, doc } from "firebase/firestore"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const tipoResiduo = formData.get("tipoResiduo")
    const descricao = formData.get("descricao")
    const quantidade = formData.get("quantidade")
    const unidade = formData.get("unidade")
    const condicoes = formData.get("condicoes")
    const disponibilidade = formData.get("disponibilidade")
    const preco = formData.get("preco")
    const userId = formData.get("userId")
    const imagens = formData.getAll("imagens") // Array de arquivos

    // Validação dos campos obrigatórios
    if (
      !tipoResiduo ||
      !descricao ||
      !quantidade ||
      !unidade ||
      !condicoes ||
      !disponibilidade ||
      !userId
    ) {
      return NextResponse.json({ error: "Dados obrigatórios faltando." }, { status: 400 })
    }

    // Busca o nome da empresa do usuário
    const userDoc = await getDoc(doc(db, "users", userId.toString()))
    const companyName = userDoc.exists() ? userDoc.data().companyName : "Empresa"

    // Cria o resíduo no Firestore, incluindo o nome da empresa
    const residueRef = await addDoc(collection(db, "residues"), {
      tipoResiduo,
      descricao,
      quantidade,
      unidade,
      condicoes,
      disponibilidade,
      preco,
      imagens,
      userId,
      companyName, // Salva o nome da empresa
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Resíduo cadastrado com sucesso!", id: residueRef.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao cadastrar resíduo." }, { status: 500 })
  }
}