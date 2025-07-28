import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/proposals-accepted?empresaId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    // Suporte a empresaId ou userId
    const empresaId = searchParams.get("empresaId") || searchParams.get("userId")
    if (!empresaId) {
      return NextResponse.json([], { status: 200 })
    }
    const empresaIdNum = parseInt(empresaId)
    if (isNaN(empresaIdNum)) {
      return NextResponse.json([], { status: 200 })
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
        residuo: { select: { tipoResiduo: true, descricao: true, empresa: { select: { nome: true } } } },
        empresaProponente: { select: { nome: true, id: true } },
        empresaReceptora: { select: { nome: true, id: true } },
        notificacoes: { select: { empresaId: true, visualizada: true, tipo: true } }
      }
    })

    // Define the type for notificacoes
    interface Notificacao {
      empresaId: number;
      visualizada: boolean;
      tipo: string;
    }

    // Define the type for empresa
    interface Empresa {
      nome: string;
      id: number;
    }

    // Define the type for residuo
    interface Residuo {
      tipoResiduo: string;
      descricao: string;
      empresa: {
        nome: string;
      };
    }

    // Define the type for proposta
    interface Proposta {
      id: number;
      mensagem: string | null;
      criadaEm: string | Date | null;
      empresaProponenteId: number;
      empresaReceptoraId: number;
      empresaProponente: Empresa;
      empresaReceptora: Empresa;
      residuo?: Residuo;
      notificacoes: Notificacao[];
    }

    // Para cada proposta, retorna quem já foi notificado (empresaId) e dados mínimos para o chat
    const result = propostas.map((p: Proposta) => {
      let companyName = "Empresa"
      const userBId = String(p.empresaProponenteId === empresaIdNum ? p.empresaReceptoraId : p.empresaProponenteId)
      if (p.empresaProponenteId === empresaIdNum) {
        companyName = p.empresaReceptora.nome
      } else if (p.empresaReceptoraId === empresaIdNum) {
        companyName = p.empresaProponente.nome
      }
      return {
        id: String(p.id),
        userBId,
        proposalData: { message: p.mensagem ?? "" },
        residueData: { companyName, descricao: p.residuo?.descricao },
        acceptedAt: p.criadaEm ? { seconds: Math.floor(new Date(p.criadaEm).getTime() / 1000) } : undefined,
        notifiedEmpresaIds: p.notificacoes
          .filter((n: Notificacao) => n.tipo === "MATCH_CONFIRMADO" && n.visualizada)
          .map((n: Notificacao) => n.empresaId)
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar matches aceitos:", error)
    return NextResponse.json([], { status: 200 })
  }
}
