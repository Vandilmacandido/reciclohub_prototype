
import { NextResponse } from "next/server";
import { PrismaClient, ImagemResiduos } from "@prisma/client";
import { uploadFileToS3 } from "@/lib/s3";
import formidable from "formidable";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Aceita multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type deve ser multipart/form-data" }, { status: 400 });
    }


    // Usar formidable para parsear o form
    const formidableModule = await import("formidable");
    const IncomingForm = formidableModule.IncomingForm;
    const form = new IncomingForm({ multiples: true });

    // Parse do form
    const formData = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      // Use Node.js IncomingMessage type for formidable
      form.parse(req as unknown as import("http").IncomingMessage, (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const fields = formData.fields;
    const files = formData.files;

    // Validação dos campos obrigatórios
    const requiredFields = [
      "tipoResiduo",
      "descricao",
      "quantidade",
      "unidade",
      "condicoes",
      "disponibilidade",
      "empresaId",
      "userId",
    ];
    for (const field of requiredFields) {
      if (
        !fields[field] ||
        (typeof fields[field] === "string" && (fields[field] as string).trim() === "")
      ) {
        return NextResponse.json(
          { error: `Por favor, preencha o campo obrigatório: ${field}.` },
          { status: 400 }
        );
      }
    }

    // Validação de imagens obrigatória
    const imagens = files.imagens || files.images || files.image;
    let imagensArray: formidable.File[] = [];
    if (Array.isArray(imagens)) imagensArray = imagens;
    else if (imagens) imagensArray = [imagens];

    if (!imagensArray.length) {
      return NextResponse.json(
        { error: "Pelo menos 1 imagem é obrigatória para cadastrar um resíduo." },
        { status: 400 }
      );
    }
    if (imagensArray.length > 5) {
      return NextResponse.json(
        { error: "Você pode enviar no máximo 5 imagens por resíduo." },
        { status: 400 }
      );
    }

    // Upload para S3
    const imagensUrls: string[] = [];
    for (const file of imagensArray) {
      try {
        const url = await uploadFileToS3({
          filepath: file.filepath,
          originalFilename: file.originalFilename ?? "",
          mimetype: file.mimetype ?? "",
        });
        imagensUrls.push(url);
      } catch (err) {
        console.error("Erro ao enviar imagem para S3:", err);
      }
    }

    if (!imagensUrls.length) {
      return NextResponse.json(
        { error: "Falha ao enviar imagens para o S3." },
        { status: 500 }
      );
    }

    // Cria o resíduo
    const residuo = await prisma.residuos.create({
      data: {
        tipoResiduo: Array.isArray(fields.tipoResiduo) ? fields.tipoResiduo[0] : fields.tipoResiduo ?? "",
        descricao: Array.isArray(fields.descricao) ? fields.descricao[0] : fields.descricao ?? "",
        quantidade: parseFloat(Array.isArray(fields.quantidade) ? fields.quantidade[0] : fields.quantidade ?? "0"),
        unidade: Array.isArray(fields.unidade) ? fields.unidade[0] : fields.unidade ?? "",
        condicoes: Array.isArray(fields.condicoes) ? fields.condicoes[0] : fields.condicoes ?? "",
        disponibilidade: Array.isArray(fields.disponibilidade) ? fields.disponibilidade[0] : fields.disponibilidade ?? "",
        preco: fields.preco
          ? (Array.isArray(fields.preco) ? fields.preco[0] : fields.preco)
          : null,
        empresaId: Number(fields.empresaId),
        userId: String(fields.userId),
      },
    });

    // Cria as imagens
    const imagensCriadas: ImagemResiduos[] = [];
    for (const url of imagensUrls) {
      try {
        const imagemCriada = await prisma.imagemResiduos.create({
          data: {
            url,
            residuoId: residuo.id,
          },
        });
        imagensCriadas.push(imagemCriada);
      } catch (imgError) {
        console.error("Erro ao salvar imagem no banco:", imgError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        id: residuo.id,
        imagensCreated: imagensCriadas.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro geral na rota de registro:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno do servidor ao cadastrar resíduo.",
      },
      { status: 500 }
    );
  }
}

