import { db } from "@/config/firebase.config"
import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validação básica dos campos obrigatórios
    if (
      !data.companyName ||
      !data.email ||
      !data.cnpj ||
      !data.cep ||
      !data.street ||
      !data.city ||
      !data.state ||
      !data.country ||
      !data.password ||
      !data.acceptTerms ||
      !data.acceptPrivacy
    ) {
      return NextResponse.json({ error: "Dados obrigatórios faltando." }, { status: 400 })
    }

    // Verifica se já existe usuário com o mesmo email
    const emailQuery = query(collection(db, "users"), where("email", "==", data.email))
    const emailSnapshot = await getDocs(emailQuery)
    if (!emailSnapshot.empty) {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 })
    }

    // Verifica se já existe usuário com o mesmo cnpj
    const cnpjQuery = query(collection(db, "users"), where("cnpj", "==", data.cnpj))
    const cnpjSnapshot = await getDocs(cnpjQuery)
    if (!cnpjSnapshot.empty) {
      return NextResponse.json({ error: "CNPJ já cadastrado." }, { status: 409 })
    }

    // Cria o usuário e pega o id gerado
    const userRef = await addDoc(collection(db, "users"), {
      ...data,
      createdAt: new Date(),
    })

    // Atualiza o documento para adicionar o campo id
    await updateDoc(doc(db, "users", userRef.id), { id: userRef.id })

    return NextResponse.json({ message: "Usuário cadastrado com sucesso!", id: userRef.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar usuário." }, { status: 500 })
  }
}



