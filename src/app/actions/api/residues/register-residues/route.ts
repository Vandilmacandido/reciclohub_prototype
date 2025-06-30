import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Debug: Log do body recebido
    console.log("Body recebido:", JSON.stringify(body, null, 2))
    console.log("Imagens recebidas:", body.imagens ? body.imagens.length : "Nenhuma")

    // Validação dos campos obrigatórios
    const requiredFields = [
      "tipoResiduo",
      "descricao",
      "quantidade",
      "unidade",
      "condicoes",
      "disponibilidade",
      "empresaId", // agora obrigatório!
    ]
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === "string" && body[field].trim() === "")) {
        return NextResponse.json({ error: `Campo obrigatório ausente: ${field}` }, { status: 400 })
      }
    }

    // Validação de imagens (máximo 5)
    if (body.imagens && Array.isArray(body.imagens) && body.imagens.length > 5) {
      return NextResponse.json({ error: "Limite de 5 imagens por resíduo excedido." }, { status: 400 })
    }

    // Cria o resíduo (id é autoincrement, empresaId e userId são obrigatórios)
    const residuo = await prisma.residuos.create({
      data: {
        tipoResiduo: body.tipoResiduo,
        descricao: body.descricao,
        quantidade: parseFloat(body.quantidade),
        unidade: body.unidade,
        condicoes: body.condicoes,
        disponibilidade: body.disponibilidade,
        preco: body.preco || null,
        empresaId: Number(body.empresaId),
        userId: String(body.userId), // Certifique-se de que userId está presente no body
      }
    })

    // Cria as imagens (se houver)
    console.log("=== DEBUG IMAGENS ===")
    console.log("body.imagens existe?", !!body.imagens)
    console.log("É array?", Array.isArray(body.imagens))
    console.log("Quantidade de imagens:", body.imagens ? body.imagens.length : 0)
    console.log("Tipo de body.imagens:", typeof body.imagens)
    
    if (body.imagens) {
      console.log("Primeira imagem completa:", body.imagens[0])
      console.log("Tamanho da primeira imagem:", body.imagens[0]?.length)
    }
    
    if (body.imagens && Array.isArray(body.imagens) && body.imagens.length > 0) {
      console.log("=== INICIANDO CRIAÇÃO DE IMAGENS ===")
      console.log("Resíduo ID:", residuo.id)
      
      const imagensParaCriar = body.imagens.slice(0, 5)
      console.log("Número de imagens a criar:", imagensParaCriar.length)
      
      for (let i = 0; i < imagensParaCriar.length; i++) {
        const img = imagensParaCriar[i]
        console.log(`\n--- Processando imagem ${i + 1} ---`)
        console.log("Tipo da imagem:", typeof img)
        console.log("Tamanho da imagem:", img?.length)
        console.log("Começa com data:image?", img?.startsWith("data:image"))
        console.log("Primeiros 100 chars:", img?.substring(0, 100))
        
        if (!img || typeof img !== 'string' || img.trim() === '') {
          console.error(`Imagem ${i + 1} inválida - está vazia ou não é string`)
          continue
        }
        
        // Verificar tamanho da imagem (limitado a ~16MB base64 que é 12MB original)
        if (img.length > 16 * 1024 * 1024) {
          console.error(`Imagem ${i + 1} muito grande: ${img.length} chars`)
          continue
        }
        
        // Verificar se é uma imagem válida
        if (!img.startsWith('data:image/')) {
          console.error(`Imagem ${i + 1} não é uma imagem válida (não começa com data:image/)`)
          continue
        }
        
        try {
          console.log(`Tentando criar imagem ${i + 1} no banco...`)
          const imagemCriada = await prisma.imagemResiduos.create({
            data: {
              url: img,
              residuoId: residuo.id,
            }
          })
          console.log(`✅ Imagem ${i + 1} criada com sucesso! ID:`, imagemCriada.id)
        } catch (imgError) {
          console.error(`❌ Erro ao criar imagem ${i + 1}:`)
          console.error("Erro completo:", imgError)
          console.error("Stack trace:", imgError instanceof Error ? imgError.stack : 'N/A')
        }
      }
      console.log("=== FINALIZOU TENTATIVA DE CRIAÇÃO DE IMAGENS ===")
    } else {
      console.log("❌ Nenhuma imagem válida para criar")
      console.log("Condições falharam:")
      console.log("- body.imagens existe:", !!body.imagens)
      console.log("- É array:", Array.isArray(body.imagens))
      console.log("- Tem elementos:", body.imagens?.length > 0)
    }

    // Verificar se as imagens foram realmente criadas
    const imagensNoBanco = await prisma.imagemResiduos.findMany({
      where: { residuoId: residuo.id }
    })
    console.log(`Total de imagens no banco para o resíduo ${residuo.id}:`, imagensNoBanco.length)
    
    return NextResponse.json({ 
      success: true, 
      id: residuo.id,
      imagensCreated: imagensNoBanco.length
    }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao cadastrar resíduo." }, { status: 500 })
  }
}