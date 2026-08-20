/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `ledger_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountType` to the `ledger_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LedgerAccountType" AS ENUM ('WALLET', 'REVENUE');

-- AlterEnum
ALTER TYPE "PaymentRequestStatus" ADD VALUE 'PROCESSING';

-- DropForeignKey
ALTER TABLE "ledger_accounts" DROP CONSTRAINT "ledger_accounts_walletId_fkey";

-- AlterTable
ALTER TABLE "ledger_accounts" ADD COLUMN     "accountType" "LedgerAccountType" NOT NULL,
ADD COLUMN     "code" TEXT,
ALTER COLUMN "walletId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ledger_accounts_code_key" ON "ledger_accounts"("code");

-- AddForeignKey
ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
