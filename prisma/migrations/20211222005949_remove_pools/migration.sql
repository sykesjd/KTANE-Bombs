/*
  Warnings:

  - You are about to drop the column `firstCompletionId` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the `Pool` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pools` to the `Bomb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first` to the `Completion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pool" DROP CONSTRAINT "Pool_bombId_fkey";

-- AlterTable
ALTER TABLE "Bomb" ADD COLUMN     "pools" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Completion" ADD COLUMN     "first" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "firstCompletionId";

-- DropTable
DROP TABLE "Pool";
