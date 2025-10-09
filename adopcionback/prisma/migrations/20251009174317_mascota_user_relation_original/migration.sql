/*
  Warnings:

  - Made the column `userId` on table `mascota` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `mascota` DROP FOREIGN KEY `Mascota_userId_fkey`;

-- DropIndex
DROP INDEX `Mascota_userId_fkey` ON `mascota`;

-- AlterTable
ALTER TABLE `mascota` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Mascota` ADD CONSTRAINT `Mascota_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
