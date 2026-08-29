/*
  Warnings:

  - A unique constraint covering the columns `[paymentRequestId,userId]` on the table `payment_authorizations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment_authorizations_paymentRequestId_userId_key" ON "payment_authorizations"("paymentRequestId", "userId");
