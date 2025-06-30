import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Teste para verificar se as novas tabelas estão disponíveis
async function testPrismaModels() {
  // Estas linhas devem compilar sem erros se o Prisma foi gerado corretamente
  const propostas = await prisma.propostas.findMany()
  const notificacoes = await prisma.notificacoes.findMany()
  
  console.log("Modelos Prisma funcionando:", { propostas, notificacoes })
}

export { testPrismaModels }
