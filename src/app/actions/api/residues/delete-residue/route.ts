import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { residueId, empresaId } = body;

    // Validação dos campos obrigatórios
    if (!residueId || !empresaId) {
      return NextResponse.json(
        { error: "residueId e empresaId são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificar se o resíduo existe e pertence à empresa
    const residuo = await prisma.residuos.findFirst({
      where: {
        id: parseInt(residueId),
        empresaId: Number(empresaId),
      },
    });

    if (!residuo) {
      return NextResponse.json(
        { error: "Resíduo não encontrado ou você não tem permissão para excluí-lo." },
        { status: 404 }
      );
    }

    // Excluir imagens relacionadas primeiro (devido à foreign key)
    await prisma.imagemResiduos.deleteMany({
      where: {
        residuoId: parseInt(residueId),
      },
    });

    // Excluir propostas relacionadas
    await prisma.propostas.deleteMany({
      where: {
        residuoId: parseInt(residueId),
      },
    });

    // Excluir o resíduo
    await prisma.residuos.delete({
      where: {
        id: parseInt(residueId),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resíduo excluído com sucesso!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir resíduo:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao excluir resíduo.",
      },
      { status: 500 }
    );
  }
}
