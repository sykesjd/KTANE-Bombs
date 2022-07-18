/*
  Warnings:

  - Added the required column `solo` to the `Completion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Completion" ADD COLUMN     "solo" BOOLEAN NOT NULL;
