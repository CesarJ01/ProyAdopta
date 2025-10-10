-- AlterTable
ALTER TABLE `mascota` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Mascota` ADD CONSTRAINT `Mascota_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
