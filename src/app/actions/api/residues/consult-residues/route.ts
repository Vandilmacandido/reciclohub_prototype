import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Parâmetros de filtro opcionais
    const empresaId = searchParams.get("empresaId");
    const tipoResiduo = searchParams.get("tipoResiduo");
    const disponibilidade = searchParams.get("disponibilidade");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    // Construir filtros dinâmicos
    const where: {
      empresaId?: number;
      tipoResiduo?: { contains: string; mode: "insensitive" };
      disponibilidade?: string;
    } = {};

    if (empresaId) {
      where.empresaId = Number(empresaId);
    }

    if (tipoResiduo) {
      where.tipoResiduo = {
        contains: tipoResiduo,
        mode: "insensitive",
      };
    }

    if (disponibilidade) {
      where.disponibilidade = disponibilidade;
    }

    // Parâmetros de paginação
    const take = limit ? Number(limit) : undefined;
    const skip = offset ? Number(offset) : undefined;

    console.log("Consultando resíduos com filtros:", where);
    console.log("Paginação - take:", take, "skip:", skip);

    // Buscar resíduos com suas imagens e dados da empresa
    const residuos = await prisma.residuos.findMany({
      where,
      include: {
        imagens: {
          select: {
            id: true,
            url: true,
          },
          orderBy: {
            id: 'asc'
          }
        },
        empresa: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cidade: true,
            estado: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take,
      skip,
    });

    // Contar total de resíduos (para paginação)
    const total = await prisma.residuos.count({ where });

    console.log(`Encontrados ${residuos.length} resíduos de um total de ${total}`);

    // Função para processar URLs de imagem
    const processImageUrl = (url: string): string => {
      // Agora a url já é pública do S3, só retorna
      return url;
    };

    // Formatar resposta
    const residuosFormatados = residuos.map((residuo) => ({
      id: residuo.id,
      tipoResiduo: residuo.tipoResiduo,
      descricao: residuo.descricao,
      quantidade: residuo.quantidade,
      unidade: residuo.unidade,
      condicoes: residuo.condicoes,
      disponibilidade: residuo.disponibilidade,
      preco: residuo.preco,
      imagens: residuo.imagens
        .map((imagem) => ({
          id: imagem.id,
          url: processImageUrl(imagem.url),
        })),
      empresa: residuo.empresa,
      totalImagens: residuo.imagens.filter(img => img.url && img.url.trim() !== '').length,
    }));

    return NextResponse.json(
      {
        success: true,
        data: residuosFormatados,
        pagination: {
          total,
          limit: take,
          offset: skip,
          hasMore: skip ? skip + residuos.length < total : residuos.length === take,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao consultar resíduos:", error);
    return NextResponse.json(
      {
        error: "Ocorreu um problema ao consultar os resíduos. Por favor, tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
