import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// PATCH /api/proposal-match-unique
export async function PATCH(req: Request) {
  try {
    const { proposalId, empresaId } = await req.json()
    if (!proposalId || !empresaId) {
      return NextResponse.json({ error: "proposalId e empresaId são obrigatórios" }, { status: 400 })
    }
    // Marca como visualizada a notificação de match para essa empresa e proposta
    await prisma.notificacoes.updateMany({
      where: {
        propostaId: parseInt(proposalId),
        empresaId: parseInt(empresaId),
        tipo: "MATCH_CONFIRMADO",
        visualizada: false
      },
      data: { visualizada: true }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao marcar match como visualizado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
