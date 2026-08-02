/*
  Warnings:

  - You are about to drop the `business_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ledger_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ledger_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sfc_devices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "business_profiles" DROP CONSTRAINT "business_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "ledger_accounts" DROP CONSTRAINT "ledger_accounts_walletId_fkey";

-- DropForeignKey
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entries_ledgerAccountId_fkey";

-- DropForeignKey
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entries_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "sfc_devices" DROP CONSTRAINT "sfc_devices_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_initiatedBy_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_userId_fkey";

-- DropTable
DROP TABLE "business_profiles";

-- DropTable
DROP TABLE "ledger_accounts";

-- DropTable
DROP TABLE "ledger_entries";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "profiles";

-- DropTable
DROP TABLE "sfc_devices";

-- DropTable
DROP TABLE "transactions";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "wallets";

-- DropEnum
DROP TYPE "AccountStatus";

-- DropEnum
DROP TYPE "Currency";

-- DropEnum
DROP TYPE "EntryType";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SFCDeviceStatus";

-- DropEnum
DROP TYPE "TransactionStatus";

-- DropEnum
DROP TYPE "TransactionType";

-- DropEnum
DROP TYPE "WalletStatus";
