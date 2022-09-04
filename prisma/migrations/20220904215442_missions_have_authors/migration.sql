/*
  Warnings:

  - You are about to drop the column `author` on the `MissionPack` table. All the data in the column will be lost.
  - Added the required column `author` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "author" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MissionPack" DROP COLUMN "author";
