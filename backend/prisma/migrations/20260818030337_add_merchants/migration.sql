-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateTable
CREATE TABLE "merchants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "status" "MerchantStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchants_userId_key" ON "merchants"("userId");

-- CreateIndex
CREATE INDEX "merchants_userId_idx" ON "merchants"("userId");

-- AddForeignKey
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
