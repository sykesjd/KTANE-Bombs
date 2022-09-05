/*
  Warnings:

  - You are about to drop the column `author` on the `Mission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "author",
ADD COLUMN     "authors" TEXT[];
