import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Rota para buscar resíduos de uma empresa específica (minhas ofertas)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const empresaId = searchParams.get("empresaId");
    const userId = searchParams.get("userId");

    if (!empresaId) {
      return NextResponse.json(
        {
          error: "empresaId é obrigatório.",
        },
        { status: 400 }
      );
    }

    console.log("Buscando resíduos da empresa:", empresaId);

    // Buscar resíduos da empresa com imagens
    const residuos = await prisma.residuos.findMany({
      where: {
        empresaId: Number(empresaId),
        ...(userId && { userId: String(userId) }),
      },
      include: {
        imagens: {
          select: {
            id: true,
            url: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    console.log(`Encontrados ${residuos.length} resíduos da empresa ${empresaId}`);

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
      totalImagens: residuo.imagens.filter((img) => img.url && img.url.trim() !== "").length,
    }));

    return NextResponse.json(
      {
        success: true,
        data: residuosFormatados,
        total: residuos.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar resíduos da empresa:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao buscar resíduos.",
      },
      { status: 500 }
    );
  }
}
