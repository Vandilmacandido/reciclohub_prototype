import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Validação básica
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 })
    }

    // Busca usuário/empresa pelo email
    const user = await prisma.empresas.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })
    }

    // Verifica a senha (bcrypt)
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 })
    }

    // Retorna dados essenciais (nunca envie a senha!)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      nome: user.nome,
      empresaId: user.id // ou user.empresaId, se existir esse campo
    }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao realizar login." }, { status: 500 })
  }
}

// Exemplo dentro do seu código de login/cadastro, após o fetch:
// localStorage.setItem("userId", data.id)
// localStorage.setItem("empresaId", data.empresaId) // data.empresaId precisa existir!