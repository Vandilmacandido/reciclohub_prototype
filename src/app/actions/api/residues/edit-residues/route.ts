import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { residueId, userId, updateData } = body;

    // Validação dos campos obrigatórios
    if (!residueId || !userId) {
      return NextResponse.json(
        { error: "residueId e userId são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificar se o resíduo existe e pertence ao usuário
    const residuo = await prisma.residuos.findFirst({
      where: {
        id: parseInt(residueId),
        userId: String(userId),
      },
    });

    if (!residuo) {
      return NextResponse.json(
        { error: "Resíduo não encontrado ou você não tem permissão para editá-lo." },
        { status: 404 }
      );
    }

    // Preparar dados para atualização
    type ResiduoUpdateData = {
      descricao?: string;
      quantidade?: number;
      unidade?: string;
      preco?: string | null;
      tipoResiduo?: string;
      condicoes?: string;
      disponibilidade?: string;
    };

    const dataToUpdate: ResiduoUpdateData = {};
    
    if (updateData.descricao !== undefined) dataToUpdate.descricao = updateData.descricao;
    if (updateData.quantidade !== undefined) dataToUpdate.quantidade = Number(updateData.quantidade);
    if (updateData.unidade !== undefined) dataToUpdate.unidade = updateData.unidade;
    if (updateData.preco !== undefined) dataToUpdate.preco = updateData.preco !== null ? String(updateData.preco) : null;
    if (updateData.tipoResiduo !== undefined) dataToUpdate.tipoResiduo = updateData.tipoResiduo;
    if (updateData.condicoes !== undefined) dataToUpdate.condicoes = updateData.condicoes;
    if (updateData.disponibilidade !== undefined) dataToUpdate.disponibilidade = updateData.disponibilidade;

    // Atualizar o resíduo
    const residuoAtualizado = await prisma.residuos.update({
      where: {
        id: parseInt(residueId),
      },
      data: dataToUpdate,
      include: {
        imagens: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resíduo atualizado com sucesso!",
        data: {
          ...residuoAtualizado,
          imagens: (residuoAtualizado.imagens ?? []).map((imagem: { id: number; url: string }) => ({
            id: imagem.id,
            url: imagem.url.startsWith("data:image") ? imagem.url : `data:image/jpeg;base64,${imagem.url}`,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao editar resíduo:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao editar resíduo.",
      },
      { status: 500 }
    );
  }
}
