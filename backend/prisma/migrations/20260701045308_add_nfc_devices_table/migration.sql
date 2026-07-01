-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MERCHANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'DEACTIVATED', 'REPORTED_LOST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "SfcDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hardwareToken" TEXT NOT NULL,
    "chipType" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SfcDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SfcDevice_hardwareToken_key" ON "SfcDevice"("hardwareToken");

-- CreateIndex
-- CREATE UNIQUE INDEX "SfcDevice_userId_status_key" ON "SfcDevice"("userId", "status");
CREATE UNIQUE INDEX "NfcDevice_one_active_per_user" 
ON "SfcDevice"("userId") 
WHERE "status" = 'ACTIVE';

-- AddForeignKey
ALTER TABLE "SfcDevice" ADD CONSTRAINT "SfcDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;