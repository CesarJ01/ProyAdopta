-- CreateTable
CREATE TABLE `Mascota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `edad` INTEGER NULL,
    `especie` VARCHAR(191) NOT NULL,
    `raza` VARCHAR(191) NULL,
    `estadoPublicacion` BOOLEAN NOT NULL DEFAULT true,
    `fotoAnimal` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
