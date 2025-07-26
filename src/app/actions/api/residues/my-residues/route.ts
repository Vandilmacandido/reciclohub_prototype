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

    // Buscar resíduos da empresa específica, incluindo as imagens e propostas
    const residuos = await prisma.residuos.findMany({
      where: {
        empresaId: empresaIdNumber
      },
      include: {
        imagens: {
          select: {
            id: true,
            url: true,
          },
          orderBy: {
            id: 'asc' // Garantir ordem consistente
          }
        },
        empresa: {
          select: {
            nome: true
          }
        },
        propostas: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })

    // Função para processar URLs de imagem
    const processImageUrl = (url: string): string => {
      // Agora a url já é pública do S3, só retorna
      return url;
    };

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
      imagens: residuo.imagens
        .map((imagem) => ({
          id: imagem.id,
          url: processImageUrl(imagem.url),
        })),
      propostas: residuo.propostas.length,
      propostasPendentes: residuo.propostas.filter(p => p.status === 'PENDENTE').length
    }))

    console.log(`✅ Retornando ${residuosFormatados.length} resíduos formatados`);

    return NextResponse.json({
      success: true,
      data: residuosFormatados,
    }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar resíduos da empresa:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}