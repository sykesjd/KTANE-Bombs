-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "missionPackId" INTEGER;

-- CreateTable
CREATE TABLE "MissionPack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,

    CONSTRAINT "MissionPack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MissionPack_name_key" ON "MissionPack"("name");

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_missionPackId_fkey" FOREIGN KEY ("missionPackId") REFERENCES "MissionPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
