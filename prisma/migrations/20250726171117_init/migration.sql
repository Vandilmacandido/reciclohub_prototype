-- CreateTable
CREATE TABLE `chat_last_seen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `lastSeenMessageId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `chat_last_seen_matchId_empresaId_key`(`matchId`, `empresaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `residuos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoResiduo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `quantidade` DOUBLE NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `condicoes` VARCHAR(191) NOT NULL,
    `disponibilidade` VARCHAR(191) NOT NULL,
    `preco` VARCHAR(191) NULL,
    `empresaId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagens_residuos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `residuoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `rua` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `aceiteTermos` BOOLEAN NOT NULL,
    `aceitePrivacidade` BOOLEAN NOT NULL,

    UNIQUE INDEX `empresas_email_key`(`email`),
    UNIQUE INDEX `empresas_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propostas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade` VARCHAR(191) NOT NULL,
    `frequencia` VARCHAR(191) NOT NULL,
    `preco` VARCHAR(191) NULL,
    `mensagem` VARCHAR(191) NULL,
    `tipoTransporte` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDENTE', 'ACEITA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
    `criadaEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadaEm` DATETIME(3) NOT NULL,
    `residuoId` INTEGER NOT NULL,
    `empresaProponenteId` INTEGER NOT NULL,
    `empresaReceptoraId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('NOVA_PROPOSTA', 'PROPOSTA_ACEITA', 'PROPOSTA_REJEITADA', 'MATCH_CONFIRMADO') NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `mensagem` VARCHAR(191) NOT NULL,
    `visualizada` BOOLEAN NOT NULL DEFAULT false,
    `criadaEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,
    `propostaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chat_last_seen` ADD CONSTRAINT `chat_last_seen_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `propostas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_last_seen` ADD CONSTRAINT `chat_last_seen_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `residuos` ADD CONSTRAINT `residuos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imagens_residuos` ADD CONSTRAINT `imagens_residuos_residuoId_fkey` FOREIGN KEY (`residuoId`) REFERENCES `residuos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_residuoId_fkey` FOREIGN KEY (`residuoId`) REFERENCES `residuos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_empresaProponenteId_fkey` FOREIGN KEY (`empresaProponenteId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_empresaReceptoraId_fkey` FOREIGN KEY (`empresaReceptoraId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `propostas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_propostaId_fkey` FOREIGN KEY (`propostaId`) REFERENCES `propostas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
