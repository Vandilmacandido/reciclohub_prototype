import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(req: Request) {
  try {
    const { residueId, empresaId } = await req.json()
    
    // Validação dos campos obrigatórios
    if (!residueId || !empresaId) {
      return NextResponse.json({ error: "residueId e empresaId são obrigatórios" }, { status: 400 })
    }

    const residueIdNumber = parseInt(residueId)
    const empresaIdNumber = parseInt(empresaId)
    
    if (isNaN(residueIdNumber) || isNaN(empresaIdNumber)) {
      return NextResponse.json({ error: "residueId e empresaId devem ser números válidos" }, { status: 400 })
    }

    // Verificar se o resíduo existe e pertence à empresa
    const residuo = await prisma.residuos.findFirst({
      where: {
        id: residueIdNumber,
        empresaId: empresaIdNumber
      }
    })

    if (!residuo) {
      return NextResponse.json({ error: "Resíduo não encontrado ou você não tem permissão para excluí-lo" }, { status: 404 })
    }

    // Deletar as imagens relacionadas primeiro (devido à foreign key)
    await prisma.imagemResiduos.deleteMany({
      where: {
        residuoId: residueIdNumber
      }
    })

    // Deletar o resíduo
    await prisma.residuos.delete({
      where: {
        id: residueIdNumber
      }
    })

    return NextResponse.json({ success: true, message: "Resíduo excluído com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao excluir resíduo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
