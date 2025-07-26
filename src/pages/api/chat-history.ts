import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }
  const { matchId } = req.query
  if (!matchId || typeof matchId !== "string") {
    return res.status(400).json({ error: "matchId is required" })
  }
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { matchId: Number(matchId) },
      orderBy: { timestamp: "asc" },
      include: { sender: { select: { id: true, nome: true } } }
    })
    res.status(200).json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch messages" })
  }
}
