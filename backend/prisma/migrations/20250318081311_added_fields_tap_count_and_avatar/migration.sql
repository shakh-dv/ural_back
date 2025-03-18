/*
  Warnings:

  - Added the required column `tapCount` to the `level_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "level_config" ADD COLUMN     "tapCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;
