import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Rota GET para buscar todos os resíduos cadastrados por uma empresa específica
 * Utiliza o empresaId para filtrar apenas os resíduos da empresa logada
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const empresaId = searchParams.get("empresaId")
    
    // Validação do empresaId
    if (!empresaId) {
      return NextResponse.json({ error: "empresaId é obrigatório" }, { status: 400 })
    }

    const empresaIdNumber = parseInt(empresaId)
    if (isNaN(empresaIdNumber)) {
      return NextResponse.json({ error: "empresaId deve ser um número válido" }, { status: 400 })
    }

    // Buscar resíduos da empresa específica, incluindo as imagens
    const residuos = await prisma.residuos.findMany({
      where: {
        empresaId: empresaIdNumber
      },
      include: {
        imagens: true,
        empresa: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        id: 'desc' // Mais recentes primeiro
      }
    })

    // Formatar os dados para o frontend
    const residuosFormatados = residuos.map(residuo => ({
      id: residuo.id.toString(),
      tipoResiduo: residuo.tipoResiduo,
      descricao: residuo.descricao,
      quantidade: residuo.quantidade,
      unidade: residuo.unidade,
      condicoes: residuo.condicoes,
      disponibilidade: residuo.disponibilidade,
      preco: residuo.preco,
      empresaId: residuo.empresaId,
      userId: residuo.userId,
      empresa: residuo.empresa.nome,
      imagens: residuo.imagens.map(img => img.url)
    }))

    return NextResponse.json(residuosFormatados, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar resíduos da empresa:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}