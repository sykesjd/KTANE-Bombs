/*
  Warnings:

  - Added the required column `tpSolve` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "tpSolve" BOOLEAN NOT NULL DEFAULT False;