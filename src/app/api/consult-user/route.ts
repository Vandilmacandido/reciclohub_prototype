import { db } from "@/config/firebase.config"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

interface RegisterUserRequest {
  companyName: string
  email: string
  cnpj: string
  cep: string
  street: string
  city: string
  state: string
  country: string
  password: string
  acceptTerms: boolean
  acceptPrivacy: boolean
}

// GET com suporte a filtro por email (para login)
export async function GET(req: NextRequest) {
  try {
    // Pega o parâmetro de email da query string, se existir
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    let usersQuery
    if (email) {
      // Busca usuário específico pelo email
      usersQuery = query(collection(db, "users"), where("email", "==", email))
    } else {
      // Busca todos os usuários
      usersQuery = collection(db, "users")
    }

    const snapshot = await getDocs(usersQuery)
    const data = snapshot.docs.map(doc => {
      const user = doc.data()
      if (email) {
        // Retorna tudo, inclusive a senha, para login
        return { id: doc.id, ...user }
      } else {
        // Não retorna senha na listagem geral
        const safeUser = { ...user }
        delete safeUser.password
        return { id: doc.id, ...safeUser }
      }
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao consultar usuários." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as RegisterUserRequest

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

    // Persistência no Firestore
    const userRef = await addDoc(collection(db, "users"), {
      companyName: data.companyName,
      email: data.email,
      cnpj: data.cnpj,
      cep: data.cep,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      password: data.password, // Em produção, nunca salve senha em texto puro!
      acceptTerms: data.acceptTerms,
      acceptPrivacy: data.acceptPrivacy,
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Usuário cadastrado com sucesso!",
        userId: userRef.id,
        user: {
          companyName: data.companyName,
          email: data.email,
          cnpj: data.cnpj,
          cep: data.cep,
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao cadastrar usuário." }, { status: 500 })
  }
}