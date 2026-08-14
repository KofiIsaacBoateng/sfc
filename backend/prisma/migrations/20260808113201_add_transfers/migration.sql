-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('COMPLETED', 'FAILED', 'REVERSED');

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "senderWalletId" TEXT NOT NULL,
    "recipientWalletId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "reference" TEXT,
    "status" "TransferStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_id_key" ON "Transfer"("id");

-- CreateIndex
CREATE INDEX "Transfer_senderWalletId_createdAt_idx" ON "Transfer"("senderWalletId", "createdAt");

-- CreateIndex
CREATE INDEX "Transfer_recipientWalletId_createdAt_idx" ON "Transfer"("recipientWalletId", "createdAt");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_senderWalletId_fkey" FOREIGN KEY ("senderWalletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_recipientWalletId_fkey" FOREIGN KEY ("recipientWalletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
