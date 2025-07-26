import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Atualiza a última mensagem visualizada
export async function POST(req: NextRequest) {
  const { matchId, empresaId, lastSeenMessageId } = await req.json();
  if (
    typeof matchId !== 'number' || isNaN(matchId) ||
    typeof empresaId !== 'number' || isNaN(empresaId) ||
    typeof lastSeenMessageId !== 'number' || isNaN(lastSeenMessageId)
  ) {
    return NextResponse.json({ error: "matchId, empresaId e lastSeenMessageId são obrigatórios e devem ser números" }, { status: 400 });
  }
  try {
    const updated = await prisma.chatLastSeen.upsert({
      where: { matchId_empresaId: { matchId, empresaId } },
      update: { lastSeenMessageId },
      create: { matchId, empresaId, lastSeenMessageId }
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar visualização" }, { status: 500 });
  }
}

// Consulta a última mensagem visualizada
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const matchId = Number(searchParams.get("matchId"));
  const empresaId = Number(searchParams.get("empresaId"));
  if (isNaN(matchId) || isNaN(empresaId)) {
    return NextResponse.json({ error: "matchId e empresaId são obrigatórios e devem ser números" }, { status: 400 });
  }
  try {
    const lastSeen = await prisma.chatLastSeen.findUnique({
      where: { matchId_empresaId: { matchId, empresaId } }
    });
    // Sempre retorna um objeto consistente
    if (!lastSeen) {
      return NextResponse.json({ lastSeenMessageId: 0 });
    }
    return NextResponse.json(lastSeen);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar visualização" }, { status: 500 });
  }
}
