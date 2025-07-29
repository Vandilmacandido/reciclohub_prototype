-- CreateEnum
CREATE TYPE "StatusProposta" AS ENUM ('PENDENTE', 'ACEITA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('NOVA_PROPOSTA', 'PROPOSTA_ACEITA', 'PROPOSTA_REJEITADA', 'MATCH_CONFIRMADO');

-- CreateTable
CREATE TABLE "residuos" (
    "id" SERIAL NOT NULL,
    "tipoResiduo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT NOT NULL,
    "condicoes" TEXT NOT NULL,
    "disponibilidade" TEXT NOT NULL,
    "preco" TEXT,
    "empresaId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "residuos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagens_residuos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "residuoId" INTEGER NOT NULL,

    CONSTRAINT "imagens_residuos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "aceiteTermos" BOOLEAN NOT NULL,
    "aceitePrivacidade" BOOLEAN NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propostas" (
    "id" SERIAL NOT NULL,
    "quantidade" TEXT NOT NULL,
    "frequencia" TEXT NOT NULL,
    "preco" TEXT,
    "mensagem" TEXT,
    "tipoTransporte" TEXT NOT NULL,
    "status" "StatusProposta" NOT NULL DEFAULT 'PENDENTE',
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,
    "residuoId" INTEGER NOT NULL,
    "empresaProponenteId" INTEGER NOT NULL,
    "empresaReceptoraId" INTEGER NOT NULL,

    CONSTRAINT "propostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoNotificacao" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "visualizada" BOOLEAN NOT NULL DEFAULT false,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresaId" INTEGER NOT NULL,
    "propostaId" INTEGER,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_last_seen" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "lastSeenMessageId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_last_seen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_email_key" ON "empresas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "chat_last_seen_matchId_empresaId_key" ON "chat_last_seen"("matchId", "empresaId");

-- AddForeignKey
ALTER TABLE "residuos" ADD CONSTRAINT "residuos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagens_residuos" ADD CONSTRAINT "imagens_residuos_residuoId_fkey" FOREIGN KEY ("residuoId") REFERENCES "residuos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas" ADD CONSTRAINT "propostas_residuoId_fkey" FOREIGN KEY ("residuoId") REFERENCES "residuos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas" ADD CONSTRAINT "propostas_empresaProponenteId_fkey" FOREIGN KEY ("empresaProponenteId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas" ADD CONSTRAINT "propostas_empresaReceptoraId_fkey" FOREIGN KEY ("empresaReceptoraId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_propostaId_fkey" FOREIGN KEY ("propostaId") REFERENCES "propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_last_seen" ADD CONSTRAINT "chat_last_seen_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_last_seen" ADD CONSTRAINT "chat_last_seen_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
