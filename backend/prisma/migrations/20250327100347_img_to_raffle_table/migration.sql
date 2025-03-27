/*
  Warnings:

  - The primary key for the `raffles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `raffles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `raffleId` on the `raffle_participants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "raffle_participants" DROP CONSTRAINT "raffle_participants_raffleId_fkey";

-- AlterTable
ALTER TABLE "raffle_participants" DROP COLUMN "raffleId",
ADD COLUMN     "raffleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "raffles" DROP CONSTRAINT "raffles_pkey",
ADD COLUMN     "imageId" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "raffles_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "raffle_participants_userId_raffleId_key" ON "raffle_participants"("userId", "raffleId");

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_participants" ADD CONSTRAINT "raffle_participants_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
