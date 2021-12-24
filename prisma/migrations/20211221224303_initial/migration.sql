-- CreateTable
CREATE TABLE "Mission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "firstCompletionId" INTEGER NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bomb" (
    "id" SERIAL NOT NULL,
    "modules" INTEGER NOT NULL,
    "time" DOUBLE PRECISION NOT NULL,
    "strikes" INTEGER NOT NULL,
    "widgets" INTEGER NOT NULL,
    "missionId" INTEGER NOT NULL,

    CONSTRAINT "Bomb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "modules" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "bombId" INTEGER NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completion" (
    "id" SERIAL NOT NULL,
    "proof" TEXT NOT NULL,
    "time" DOUBLE PRECISION NOT NULL,
    "team" TEXT[],
    "missionId" INTEGER NOT NULL,

    CONSTRAINT "Completion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bomb" ADD CONSTRAINT "Bomb_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pool" ADD CONSTRAINT "Pool_bombId_fkey" FOREIGN KEY ("bombId") REFERENCES "Bomb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Completion" ADD CONSTRAINT "Completion_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
