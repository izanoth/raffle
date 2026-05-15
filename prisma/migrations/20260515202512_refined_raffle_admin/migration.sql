/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `raffle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[winnerId]` on the table `raffle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('ACTIVE', 'FINISHED', 'CANCELLED');

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "raffleId" INTEGER;

-- AlterTable
ALTER TABLE "raffle" ADD COLUMN     "drawDate" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "status" "RaffleStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "winnerId" INTEGER;

-- CreateTable
CREATE TABLE "configs" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configs_key_key" ON "configs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "raffle_number_key" ON "raffle"("number");

-- CreateIndex
CREATE UNIQUE INDEX "raffle_winnerId_key" ON "raffle"("winnerId");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "raffle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle" ADD CONSTRAINT "raffle_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
