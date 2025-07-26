import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const matchId = searchParams.get("matchId")
  if (!matchId) {
    return NextResponse.json({ error: "matchId is required" }, { status: 400 })
  }
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { matchId: Number(matchId) },
      orderBy: { timestamp: "asc" },
      include: { sender: { select: { id: true, nome: true } } }
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
