import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Rota para busca avançada de resíduos
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    console.log("Filtros de busca recebidos:", body)
    
    const {
      tipoResiduo,
      disponibilidade,
      cidade,
      estado,
      quantidadeMin,
      quantidadeMax,
      unidade,
      temImagem,
      search, // busca textual na descrição
      page = 1,
      limit = 10
    } = body
    
    // Construir filtros
    const where: {
      tipoResiduo?: { in: string[] } | string
      disponibilidade?: { in: string[] } | string
      quantidade?: { gte?: number; lte?: number }
      unidade?: string
      empresa?: {
        cidade?: { contains: string; mode: 'insensitive' }
        estado?: { contains: string; mode: 'insensitive' }
      }
      imagens?: { some: object } | { none: object }
      OR?: Array<{
        descricao?: { contains: string; mode: 'insensitive' }
        tipoResiduo?: { contains: string; mode: 'insensitive' }
        condicoes?: { contains: string; mode: 'insensitive' }
      }>
    } = {}
    
    // Filtro por tipo de resíduo
    if (tipoResiduo) {
      if (Array.isArray(tipoResiduo)) {
        where.tipoResiduo = { in: tipoResiduo }
      } else {
        where.tipoResiduo = tipoResiduo
      }
    }
    
    // Filtro por disponibilidade
    if (disponibilidade) {
      if (Array.isArray(disponibilidade)) {
        where.disponibilidade = { in: disponibilidade }
      } else {
        where.disponibilidade = disponibilidade
      }
    }
    
    // Filtro por quantidade
    if (quantidadeMin !== undefined || quantidadeMax !== undefined) {
      where.quantidade = {}
      if (quantidadeMin !== undefined) {
        where.quantidade.gte = Number(quantidadeMin)
      }
      if (quantidadeMax !== undefined) {
        where.quantidade.lte = Number(quantidadeMax)
      }
    }
    
    // Filtro por unidade
    if (unidade) {
      where.unidade = unidade
    }
    
    // Filtro por localização
    if (cidade || estado) {
      where.empresa = {}
      if (cidade) {
        where.empresa.cidade = { contains: cidade, mode: 'insensitive' }
      }
      if (estado) {
        where.empresa.estado = { contains: estado, mode: 'insensitive' }
      }
    }
    
    // Filtro por presença de imagem
    if (temImagem !== undefined) {
      if (temImagem) {
        where.imagens = { some: {} }
      } else {
        where.imagens = { none: {} }
      }
    }
    
    // Busca textual
    if (search && search.trim()) {
      where.OR = [
        { descricao: { contains: search, mode: 'insensitive' } },
        { tipoResiduo: { contains: search, mode: 'insensitive' } },
        { condicoes: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Paginação
    const skip = (page - 1) * limit
    const take = limit
    
    console.log("Filtros construídos:", JSON.stringify(where, null, 2))
    
    // Buscar resíduos
    const [residuos, total] = await Promise.all([
      prisma.residuos.findMany({
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
          id: 'desc'
        },
        skip,
        take
      }),
      prisma.residuos.count({ where })
    ])
    
    console.log(`Busca avançada: ${residuos.length} resíduos encontrados de ${total} total`)
    
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
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error("Erro na busca avançada:", error)
    return NextResponse.json({ 
      error: "Erro interno do servidor na busca avançada." 
    }, { status: 500 })
  }
}
