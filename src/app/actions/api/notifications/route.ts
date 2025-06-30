import { NextResponse } from "next/server"


/**
 * Rota GET para buscar notificações de uma empresa
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const empresaId = searchParams.get("empresaId")
    
    if (!empresaId) {
      return NextResponse.json({ error: "empresaId é obrigatório" }, { status: 400 })
    }

    const empresaIdNumber = parseInt(empresaId)
    if (isNaN(empresaIdNumber)) {
      return NextResponse.json({ error: "empresaId deve ser um número válido" }, { status: 400 })
    }

    // TODO: Quando o schema estiver atualizado, implementar a busca real
    // const where = {
    //   empresaId: empresaIdNumber,
    //   ...(apenasNaoVisualizadas ? { visualizada: false } : {})
    // }

    // const notificacoes = await prisma.notificacoes.findMany({
    //   where,
    //   include: {
    //     proposta: {
    //       include: {
    //         residuo: true,
    //         empresaProponente: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     criadaEm: 'desc'
    //   }
    // })

    // Por enquanto, retornar array vazio
    const notificacoes: unknown[] = []

    return NextResponse.json({
      notificacoes,
      totalNaoVisualizadas: 0
    }, { status: 200 })

  } catch (error) {
    console.error("Erro ao buscar notificações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

/**
 * Rota PATCH para marcar notificações como visualizadas
 */
export async function PATCH(req: Request) {
  try {
    const { empresaId } = await req.json()
    
    if (!empresaId) {
      return NextResponse.json({ error: "empresaId é obrigatório" }, { status: 400 })
    }

    // TODO: Quando o schema estiver atualizado, implementar a atualização real
    // if (notificacaoIds && Array.isArray(notificacaoIds)) {
    //   await prisma.notificacoes.updateMany({
    //     where: {
    //       id: { in: notificacaoIds.map(id => parseInt(id)) },
    //       empresaId: parseInt(empresaId)
    //     },
    //     data: {
    //       visualizada: true
    //     }
    //   })
    // } else {
    //   // Marcar todas como visualizadas
    //   await prisma.notificacoes.updateMany({
    //     where: {
    //       empresaId: parseInt(empresaId),
    //       visualizada: false
    //     },
    //     data: {
    //       visualizada: true
    //     }
    //   })
    // }

    return NextResponse.json({ 
      success: true, 
      message: "Notificações marcadas como visualizadas" 
    }, { status: 200 })

  } catch (error) {
    console.error("Erro ao marcar notificações como visualizadas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
