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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
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

-- AddForeignKey
ALTER TABLE `residuos` ADD CONSTRAINT `residuos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imagens_residuos` ADD CONSTRAINT `imagens_residuos_residuoId_fkey` FOREIGN KEY (`residuoId`) REFERENCES `residuos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
