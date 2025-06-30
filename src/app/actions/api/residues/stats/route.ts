import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Rota para buscar estatísticas dos resíduos
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    const empresaId = searchParams.get('empresaId')
    
    console.log("Buscando estatísticas dos resíduos", empresaId ? `para empresa ${empresaId}` : "gerais")
    
    // Filtro base
    const whereFilter = empresaId ? { empresaId: Number(empresaId) } : {}
    
    // Estatísticas gerais
    const [
      totalResiduos,
      totalPorTipo,
      totalPorDisponibilidade,
      totalComImagem,
      totalSemImagem
    ] = await Promise.all([
      // Total de resíduos
      prisma.residuos.count({ where: whereFilter }),
      
      // Total por tipo de resíduo
      prisma.residuos.groupBy({
        by: ['tipoResiduo'],
        where: whereFilter,
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      }),
      
      // Total por disponibilidade
      prisma.residuos.groupBy({
        by: ['disponibilidade'],
        where: whereFilter,
        _count: {
          id: true
        }
      }),
      
      // Total com pelo menos uma imagem
      prisma.residuos.count({
        where: {
          ...whereFilter,
          imagens: {
            some: {}
          }
        }
      }),
      
      // Total sem imagens
      prisma.residuos.count({
        where: {
          ...whereFilter,
          imagens: {
            none: {}
          }
        }
      })
    ])
    
    // Calcular quantidade total de resíduos por unidade
    const residuosComQuantidade = await prisma.residuos.findMany({
      where: whereFilter,
      select: {
        quantidade: true,
        unidade: true
      }
    })
    
    const quantidadePorUnidade = residuosComQuantidade.reduce((acc, residuo) => {
      const unidade = residuo.unidade
      if (!acc[unidade]) {
        acc[unidade] = 0
      }
      acc[unidade] += residuo.quantidade
      return acc
    }, {} as Record<string, number>)
    
    console.log(`Estatísticas calculadas: ${totalResiduos} resíduos, ${totalComImagem} com imagem`)
    
    return NextResponse.json({
      success: true,
      data: {
        totais: {
          residuos: totalResiduos,
          comImagem: totalComImagem,
          semImagem: totalSemImagem,
          percentualComImagem: totalResiduos > 0 ? Math.round((totalComImagem / totalResiduos) * 100) : 0
        },
        porTipo: totalPorTipo.map(item => ({
          tipo: item.tipoResiduo,
          quantidade: item._count.id
        })),
        porDisponibilidade: totalPorDisponibilidade.map(item => ({
          disponibilidade: item.disponibilidade,
          quantidade: item._count.id
        })),
        quantidadePorUnidade: Object.entries(quantidadePorUnidade).map(([unidade, quantidade]) => ({
          unidade,
          quantidade: Math.round(quantidade * 100) / 100 // Arredondar para 2 casas decimais
        }))
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json({ 
      error: "Erro interno do servidor ao buscar estatísticas." 
    }, { status: 500 })
  }
}
