-- CreateEnum
CREATE TYPE "ProvisionedDeviceStatus" AS ENUM ('AVAILABLE', 'CLAIMED', 'REVOKED', 'RETIRED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('CARD', 'BRACELET', 'RING', 'KEYCHAIN', 'STICKER');

-- CreateEnum
CREATE TYPE "SecurityTier" AS ENUM ('BASIC', 'SECURE');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'LOST', 'REVOKED');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING_ONBOARDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('INDIVIDUAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PAYMENT_RECEIVED', 'PAYMENT_SENT', 'PAYMENT_FAILED', 'PAYMENT_REVERSED', 'PAYMENT_REFUNDED', 'DEVICE_LINKED', 'DEVICE_UNLINKED', 'LOW_BALANCE', 'ACCOUNT_CREATED', 'SECURITY_ALERT', 'BUSINESS_PAYMENT_RECEIVED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'DEPOSIT', 'WITHDRAWAL', 'REFUND', 'REVERSAL');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('GHS');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE', 'LOCKED', 'CLOSED');

-- CreateTable
CREATE TABLE "device_editions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isLimited" BOOLEAN NOT NULL DEFAULT false,
    "maxDevices" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_editions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provisioned_devices" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "activationCodeHash" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "securityTier" "SecurityTier" NOT NULL,
    "status" "ProvisionedDeviceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "claimedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provisioned_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sfc_devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provisionedDeviceId" TEXT NOT NULL,
    "tagUid" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sfc_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "pinHash" TEXT,
    "status" "AccountStatus" NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_accounts" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "ledgerAccountId" TEXT NOT NULL,
    "entryType" "EntryType" NOT NULL,
    "amount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "amount" BIGINT NOT NULL,
    "currency" "Currency" NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "balanceMinor" INTEGER NOT NULL DEFAULT 0,
    "status" "WalletStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_editions_code_key" ON "device_editions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "provisioned_devices_serialNumber_key" ON "provisioned_devices"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "provisioned_devices_activationCodeHash_key" ON "provisioned_devices"("activationCodeHash");

-- CreateIndex
CREATE UNIQUE INDEX "sfc_devices_id_key" ON "sfc_devices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sfc_devices_provisionedDeviceId_key" ON "sfc_devices"("provisionedDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "sfc_devices_tagUid_key" ON "sfc_devices"("tagUid");

-- CreateIndex
CREATE INDEX "sfc_devices_userId_idx" ON "sfc_devices"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUid_key" ON "users"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE INDEX "users_phoneNumber_idx" ON "users"("phoneNumber");

-- CreateIndex
CREATE INDEX "users_firebaseUid_idx" ON "users"("firebaseUid");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_id_key" ON "profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_userId_idx" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_id_key" ON "business_profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_userId_key" ON "business_profiles"("userId");

-- CreateIndex
CREATE INDEX "business_profiles_userId_idx" ON "business_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_accounts_id_key" ON "ledger_accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_accounts_walletId_key" ON "ledger_accounts"("walletId");

-- CreateIndex
CREATE INDEX "ledger_accounts_walletId_idx" ON "ledger_accounts"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_id_key" ON "ledger_entries"("id");

-- CreateIndex
CREATE INDEX "ledger_entries_transactionId_idx" ON "ledger_entries"("transactionId");

-- CreateIndex
CREATE INDEX "ledger_entries_ledgerAccountId_idx" ON "ledger_entries"("ledgerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_id_key" ON "notifications"("id");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");

-- CreateIndex
CREATE INDEX "transactions_reference_idx" ON "transactions"("reference");

-- CreateIndex
CREATE INDEX "transactions_initiatedBy_idx" ON "transactions"("initiatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_id_key" ON "wallets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- CreateIndex
CREATE INDEX "wallets_userId_idx" ON "wallets"("userId");

-- AddForeignKey
ALTER TABLE "provisioned_devices" ADD CONSTRAINT "provisioned_devices_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "device_editions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sfc_devices" ADD CONSTRAINT "sfc_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sfc_devices" ADD CONSTRAINT "sfc_devices_provisionedDeviceId_fkey" FOREIGN KEY ("provisionedDeviceId") REFERENCES "provisioned_devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_ledgerAccountId_fkey" FOREIGN KEY ("ledgerAccountId") REFERENCES "ledger_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_initiatedBy_fkey" FOREIGN KEY ("initiatedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
