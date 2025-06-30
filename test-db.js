const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log("🔍 Verificando empresas...")
    
    // Verificar empresas com mais detalhes
    const empresas = await prisma.empresas.findMany({
      select: { id: true, nome: true, email: true }
    })
    console.log("👥 Empresas no banco:")
    empresas.forEach(emp => {
      console.log(`  - ID: ${emp.id}, Nome: ${emp.nome}, Email: ${emp.email}`)
    })
    
  } catch (error) {
    console.error("❌ Erro ao testar banco:", error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
