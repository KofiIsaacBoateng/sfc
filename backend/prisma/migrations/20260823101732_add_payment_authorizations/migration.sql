-- CreateEnum
CREATE TYPE "PaymentAuthorizationMethod" AS ENUM ('PIN', 'SECURE_SFC');

-- CreateEnum
CREATE TYPE "PaymentAuthorizationChannel" AS ENUM ('APP', 'USSD');

-- CreateEnum
CREATE TYPE "PaymentAuthorizationStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CONSUMED', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "payment_authorizations" (
    "id" TEXT NOT NULL,
    "paymentRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "method" "PaymentAuthorizationMethod" NOT NULL,
    "channel" "PaymentAuthorizationChannel" NOT NULL,
    "status" "PaymentAuthorizationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "authorizedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_authorizations_paymentRequestId_status_idx" ON "payment_authorizations"("paymentRequestId", "status");

-- CreateIndex
CREATE INDEX "payment_authorizations_userId_status_idx" ON "payment_authorizations"("userId", "status");

-- CreateIndex
CREATE INDEX "payment_authorizations_expiresAt_idx" ON "payment_authorizations"("expiresAt");

-- AddForeignKey
ALTER TABLE "payment_authorizations" ADD CONSTRAINT "payment_authorizations_paymentRequestId_fkey" FOREIGN KEY ("paymentRequestId") REFERENCES "payment_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_authorizations" ADD CONSTRAINT "payment_authorizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
