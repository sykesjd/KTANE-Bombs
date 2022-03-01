/*
  Warnings:

  - You are about to drop the column `proof` on the `Completion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Completion" DROP COLUMN "proof",
ADD COLUMN     "proofs" TEXT[];
