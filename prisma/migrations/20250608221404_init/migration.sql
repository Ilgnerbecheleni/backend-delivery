-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `resetPass` BOOLEAN NULL DEFAULT false,
    `role` ENUM('USER', 'ADMIN') NOT NULL,
    `placa_veiculo` VARCHAR(191) NULL,
    `verificado` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endereco_users` (
    `id` VARCHAR(191) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `endereco_users_userid_key`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entregas` (
    `id` VARCHAR(191) NOT NULL,
    `id_comerciante` VARCHAR(191) NOT NULL,
    `id_entregador` VARCHAR(191) NOT NULL,
    `endereco_coleta` VARCHAR(191) NOT NULL,
    `endereco_entrega` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(65, 30) NOT NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes` (
    `id` VARCHAR(191) NOT NULL,
    `id_entrega` VARCHAR(191) NOT NULL,
    `nota` INTEGER NOT NULL,
    `comentario` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `avaliacoes_id_entrega_key`(`id_entrega`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transacoes` (
    `id` VARCHAR(191) NOT NULL,
    `id_entregador` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(65, 30) NOT NULL,
    `tipo` ENUM('ENTRADA', 'SAQUE') NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saldos` (
    `id` VARCHAR(191) NOT NULL,
    `id_entregador` VARCHAR(191) NOT NULL,
    `saldo_atual` DECIMAL(65, 30) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `saldos_id_entregador_key`(`id_entregador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `endereco_users` ADD CONSTRAINT `endereco_users_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entregas` ADD CONSTRAINT `entregas_id_comerciante_fkey` FOREIGN KEY (`id_comerciante`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entregas` ADD CONSTRAINT `entregas_id_entregador_fkey` FOREIGN KEY (`id_entregador`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_id_entrega_fkey` FOREIGN KEY (`id_entrega`) REFERENCES `entregas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacoes` ADD CONSTRAINT `transacoes_id_entregador_fkey` FOREIGN KEY (`id_entregador`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saldos` ADD CONSTRAINT `saldos_id_entregador_fkey` FOREIGN KEY (`id_entregador`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
