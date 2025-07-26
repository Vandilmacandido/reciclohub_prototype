import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do resíduo é obrigatório." },
        { status: 400 }
      );
    }

    const residuo = await prisma.residuos.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        imagens: {
          select: {
            id: true,
            url: true,
          },
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
    });

    if (!residuo) {
      return NextResponse.json(
        { error: "Resíduo não encontrado." },
        { status: 404 }
      );
    }

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
      empresaId: residuo.empresaId,
      userId: residuo.userId,
      imagens: residuo.imagens.map((imagem) => ({
        id: imagem.id,
        url: imagem.url, // Agora retorna a URL do S3 diretamente
      })),
      empresa: residuo.empresa,
    };

    return NextResponse.json(residuoFormatado, { status: 200 });
  } catch (error) {
    console.error("Erro ao consultar resíduo:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao consultar resíduo.",
      },
      { status: 500 }
    );
  }
}
