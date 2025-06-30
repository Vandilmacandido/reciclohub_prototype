import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()


// Função para validar CNPJ (apenas quantidade de dígitos)
function isValidCNPJ(cnpj: string) {
  const onlyNumbers = cnpj.replace(/\D/g, "")
  return onlyNumbers.length === 14
}

// Função para validar e-mail simples
function isValidEmail(email: string) {
  return typeof email === "string" && email.includes("@")
}

// Todos os campos obrigatórios do model Empresas
const requiredFields = [
  "nome",
  "email",
  "telefone",
  "password",
  "cnpj",
  "rua",
  "numero",
  "cep",
  "cidade",
  "estado",
  "pais",
  "aceiteTermos",
  "aceitePrivacidade"
]

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Mapeamento dos campos do frontend para o backend
    const empresaData = {
      // id: generateCustomId(), // Remove this line if Prisma auto-generates the ID
      nome: data.companyName || data.nome,
      email: data.email,
      telefone: data.telefone || "",
      password: data.password,
      cnpj: data.cnpj ? data.cnpj.replace(/\D/g, "") : "",
      rua: data.street || data.rua,
      numero: data.numero || "S/N",
      cep: data.cep,
      cidade: data.city || data.cidade,
      estado: data.state || data.estado,
      pais: data.country || data.pais,
      aceiteTermos: !!data.acceptTerms || !!data.aceiteTermos,
      aceitePrivacidade: !!data.acceptPrivacy || !!data.aceitePrivacidade,
    }

    // Validação de campos obrigatórios
    for (const field of requiredFields) {
      if (
        empresaData[field as keyof typeof empresaData] === undefined ||
        empresaData[field as keyof typeof empresaData] === "" ||
        empresaData[field as keyof typeof empresaData] === false
      ) {
        return NextResponse.json({ error: `Campo obrigatório ausente: ${field}` }, { status: 400 })
      }
    }

    // Validação de CNPJ
    if (!isValidCNPJ(empresaData.cnpj)) {
      return NextResponse.json({ error: "CNPJ inválido. Deve conter 14 dígitos numéricos." }, { status: 400 })
    }

    // Validação de e-mail
    if (!isValidEmail(empresaData.email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 })
    }

    // Verificar se já existe empresa com o mesmo CNPJ ou e-mail
    const existing = await prisma.empresas.findFirst({
      where: {
        OR: [
          { cnpj: empresaData.cnpj },
          { email: empresaData.email }
        ]
      }
    })
    if (existing) {
      if (existing.email === empresaData.email) {
        return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 })
      }
      if (existing.cnpj === empresaData.cnpj) {
        return NextResponse.json({ error: "CNPJ já cadastrado." }, { status: 409 })
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(empresaData.password, 10)

    // Criação da empresa
    await prisma.empresas.create({
      data: {
        ...empresaData,
        password: hashedPassword,
      }
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error(error)
        return NextResponse.json({ error: "Erro ao cadastrar empresa." }, { status: 500 })
      }
    }

// Remove this function if not needed, or implement it to return a string if you want custom IDs
// function generateCustomId() {
//   return crypto.randomUUID(); // or any string ID generator
// }
