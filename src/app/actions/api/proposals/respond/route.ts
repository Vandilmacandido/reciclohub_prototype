import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Rota PATCH para aceitar ou rejeitar uma proposta
 */
export async function PATCH(req: Request) {
  try {
    const { propostaId, empresaId, acao } = await req.json()
    
    // Validação
    if (!propostaId || !empresaId || !acao) {
      return NextResponse.json({ 
        error: "propostaId, empresaId e acao são obrigatórios" 
      }, { status: 400 })
    }

    if (!['aceitar', 'rejeitar'].includes(acao)) {
      return NextResponse.json({ 
        error: "acao deve ser 'aceitar' ou 'rejeitar'" 
      }, { status: 400 })
    }

    // Buscar a proposta e verificar autorização
    const proposta = await prisma.propostas.findFirst({
      where: {
        id: parseInt(propostaId),
        empresaReceptoraId: parseInt(empresaId),
        status: 'PENDENTE'
      },
      include: {
        empresaProponente: {
          select: {
            nome: true
          }
        },
        residuo: {
          select: {
            descricao: true
          }
        }
      }
    })

    if (!proposta) {
      return NextResponse.json({ 
        error: "Proposta não encontrada ou não autorizada" 
      }, { status: 404 })
    }

    const novoStatus = acao === 'aceitar' ? 'ACEITA' : 'REJEITADA'
    
    // Atualizar status da proposta
    await prisma.propostas.update({
      where: { id: parseInt(propostaId) },
      data: { status: novoStatus }
    })

    // Criar notificação para a empresa proponente
    const tipoNotificacao = acao === 'aceitar' ? 'PROPOSTA_ACEITA' : 'PROPOSTA_REJEITADA'
    const tituloNotificacao = acao === 'aceitar' ? 'Proposta aceita!' : 'Proposta rejeitada'
    const mensagemNotificacao = acao === 'aceitar' 
      ? `Sua proposta para o resíduo "${proposta.residuo.descricao}" foi aceita!`
      : `Sua proposta para o resíduo "${proposta.residuo.descricao}" foi rejeitada.`

    await prisma.notificacoes.create({
      data: {
        tipo: tipoNotificacao,
        titulo: tituloNotificacao,
        mensagem: mensagemNotificacao,
        empresaId: proposta.empresaProponenteId,
        propostaId: proposta.id
      }
    })

    // Se foi aceita, criar notificação de match
    if (acao === 'aceitar') {
      await prisma.notificacoes.create({
        data: {
          tipo: 'MATCH_CONFIRMADO',
          titulo: 'Match confirmado!',
          mensagem: `Você tem um match com ${proposta.empresaProponente.nome}`,
          empresaId: proposta.empresaProponenteId,
          propostaId: proposta.id
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Proposta ${acao === 'aceitar' ? 'aceita' : 'rejeitada'} com sucesso`,
      matchCreated: acao === 'aceitar'
    }, { status: 200 })

  } catch (error) {
    console.error("Erro ao processar proposta:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
