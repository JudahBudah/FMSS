-- CreateEnum
CREATE TYPE "Source" AS ENUM ('MOCK', 'SENSOR');

-- CreateTable
CREATE TABLE "readings" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moisture" DECIMAL(5,2) NOT NULL,
    "ph" DECIMAL(4,2) NOT NULL,
    "nitrogen" INTEGER NOT NULL,
    "phosphorus" INTEGER NOT NULL,
    "potassium" INTEGER NOT NULL,
    "temperature" DECIMAL(5,2) NOT NULL,
    "conductivity" DECIMAL(10,2) NOT NULL,
    "source" "Source" NOT NULL DEFAULT 'MOCK',

    CONSTRAINT "readings_pkey" PRIMARY KEY ("id")
);
