/*
  Warnings:

  - Added the required column `old` to the `Completion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Completion" ADD COLUMN     "old" BOOLEAN NOT NULL;
