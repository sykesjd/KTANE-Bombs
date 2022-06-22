-- DropForeignKey
ALTER TABLE "Bomb" DROP CONSTRAINT "Bomb_missionId_fkey";

-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_missionId_fkey";

-- AddForeignKey
ALTER TABLE "Bomb" ADD CONSTRAINT "Bomb_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Completion" ADD CONSTRAINT "Completion_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
