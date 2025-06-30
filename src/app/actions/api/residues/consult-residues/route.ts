import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    // Parâmetros de filtro opcionais
    const empresaId = searchParams.get('empresaId')
    const tipoResiduo = searchParams.get('tipoResiduo')
    const disponibilidade = searchParams.get('disponibilidade')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    
    // Construir filtros dinâmicos
    const where: {
      empresaId?: number
      tipoResiduo?: { contains: string; mode: 'insensitive' }
      disponibilidade?: string
    } = {}
    
    if (empresaId) {
      where.empresaId = Number(empresaId)
    }
    
    if (tipoResiduo) {
      where.tipoResiduo = {
        contains: tipoResiduo,
        mode: 'insensitive'
      }
    }
    
    if (disponibilidade) {
      where.disponibilidade = disponibilidade
    }
    
    // Parâmetros de paginação
    const take = limit ? Number(limit) : undefined
    const skip = offset ? Number(offset) : undefined
    
    console.log("Consultando resíduos com filtros:", where)
    console.log("Paginação - take:", take, "skip:", skip)
    
    // Buscar resíduos com suas imagens e dados da empresa
    const residuos = await prisma.residuos.findMany({
      where,
      include: {
        imagens: {
          select: {
            id: true,
            url: true
          }
        },
        empresa: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cidade: true,
            estado: true
          }
        }
      },
      orderBy: {
        id: 'desc' // Mais recentes primeiro
      },
      take,
      skip
    })
    
    // Contar total de resíduos (para paginação)
    const total = await prisma.residuos.count({ where })
    
    console.log(`Encontrados ${residuos.length} resíduos de um total de ${total}`)
    
    // Formatar resposta
    const residuosFormatados = residuos.map(residuo => ({
      id: residuo.id,
      tipoResiduo: residuo.tipoResiduo,
      descricao: residuo.descricao,
      quantidade: residuo.quantidade,
      unidade: residuo.unidade,
      condicoes: residuo.condicoes,
      disponibilidade: residuo.disponibilidade,
      preco: residuo.preco,
      imagens: residuo.imagens,
      empresa: residuo.empresa,
      totalImagens: residuo.imagens.length
    }))
    
    return NextResponse.json({
      success: true,
      data: residuosFormatados,
      pagination: {
        total,
        limit: take,
        offset: skip,
        hasMore: skip ? (skip + residuos.length) < total : residuos.length === take
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error("Erro ao consultar resíduos:", error)
    return NextResponse.json({ 
      error: "Erro interno do servidor ao consultar resíduos." 
    }, { status: 500 })
  }
}

// Rota para buscar um resíduo específico por ID
export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json({ 
        error: "ID do resíduo é obrigatório." 
      }, { status: 400 })
    }
    
    console.log("Buscando resíduo com ID:", id)
    
    const residuo = await prisma.residuos.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        imagens: {
          select: {
            id: true,
            url: true
          }
        },
        empresa: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cnpj: true,
            rua: true,
            numero: true,
            cep: true,
            cidade: true,
            estado: true,
            pais: true
          }
        }
      }
    })
    
    if (!residuo) {
      return NextResponse.json({ 
        error: "Resíduo não encontrado." 
      }, { status: 404 })
    }
    
    console.log(`Resíduo encontrado: ${residuo.tipoResiduo} - ${residuo.imagens.length} imagens`)
    
    // Formatar resposta
    const residuoFormatado = {
      id: residuo.id,
      tipoResiduo: residuo.tipoResiduo,
      descricao: residuo.descricao,
      quantidade: residuo.quantidade,
      unidade: residuo.unidade,
      condicoes: residuo.condicoes,
      disponibilidade: residuo.disponibilidade,
      preco: residuo.preco,
      imagens: residuo.imagens,
      empresa: residuo.empresa,
      totalImagens: residuo.imagens.length
    }
    
    return NextResponse.json({
      success: true,
      data: residuoFormatado
    }, { status: 200 })
    
  } catch (error) {
    console.error("Erro ao buscar resíduo:", error)
    return NextResponse.json({ 
      error: "Erro interno do servidor ao buscar resíduo." 
    }, { status: 500 })
  }
}
