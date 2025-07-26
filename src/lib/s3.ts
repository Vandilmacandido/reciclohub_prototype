import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;

interface UploadFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
}

export async function uploadFileToS3(file: UploadFile): Promise<string> {
  console.log("[S3] uploadFileToS3 - file:", file);
  console.log("[S3] ENV BUCKET:", BUCKET);
  console.log("[S3] ENV REGION:", process.env.AWS_REGION);
  console.log("[S3] ENV ACCESS_KEY:", process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING");
  console.log("[S3] ENV SECRET_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "OK" : "MISSING");

  if (!fs.existsSync(file.filepath)) {
    throw new Error(`[S3] Arquivo não encontrado: ${file.filepath}`);
  }

  const fileStream = fs.createReadStream(file.filepath);
  const fileExt = file.originalFilename.split(".").pop();
  const key = `residuos/${uuidv4()}.${fileExt}`;

  try {
    const result = await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
      })
    );
    console.log("[S3] Upload result:", result);
  } catch (err) {
    console.error("[S3] Erro ao enviar para o S3:", err);
    throw err;
  }

  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
}
