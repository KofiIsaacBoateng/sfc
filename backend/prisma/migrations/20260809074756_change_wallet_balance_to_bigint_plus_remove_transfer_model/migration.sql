/*
  Warnings:

  - You are about to drop the `Transfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_recipientWalletId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_senderWalletId_fkey";

-- AlterTable
ALTER TABLE "wallets" ALTER COLUMN "balanceMinor" SET DATA TYPE BIGINT;

-- DropTable
DROP TABLE "Transfer";

-- DropEnum
DROP TYPE "TransferStatus";
