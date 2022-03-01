/*
  Warnings:

  - The `proof` column on the `Completion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Completion" DROP COLUMN "proof",
ADD COLUMN     "proof" TEXT[];
