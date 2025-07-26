import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/proposals-accepted?empresaId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const empresaId = searchParams.get("empresaId")
    if (!empresaId) {
      return NextResponse.json({ error: "empresaId é obrigatório" }, { status: 400 })
    }
    const empresaIdNum = parseInt(empresaId)
    if (isNaN(empresaIdNum)) {
      return NextResponse.json({ error: "empresaId deve ser um número válido" }, { status: 400 })
    }

    // Busca todas as propostas ACEITAS em que a empresa é proponente OU receptora
    const propostas = await prisma.propostas.findMany({
      where: {
        status: "ACEITA",
        OR: [
          { empresaProponenteId: empresaIdNum },
          { empresaReceptoraId: empresaIdNum }
        ]
      },
      include: {
        residuo: { select: { tipoResiduo: true, empresa: { select: { nome: true } } } },
        empresaProponente: { select: { nome: true, id: true } },
        empresaReceptora: { select: { nome: true, id: true } },
        notificacoes: { select: { empresaId: true, visualizada: true, tipo: true } }
      }
    })

    // Para cada proposta, retorna quem já foi notificado (empresaId)
    const result = propostas.map((p) => {
      // Nome da empresa do outro lado do match
      let companyName = "Empresa"
      if (p.empresaProponenteId === empresaIdNum) {
        companyName = p.empresaReceptora.nome
      } else if (p.empresaReceptoraId === empresaIdNum) {
        companyName = p.empresaProponente.nome
      }
      return {
        id: p.id,
        residueData: { companyName },
        notifiedEmpresaIds: p.notificacoes
          .filter((n) => n.tipo === "MATCH_CONFIRMADO" && n.visualizada)
          .map((n) => n.empresaId)
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar matches aceitos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
