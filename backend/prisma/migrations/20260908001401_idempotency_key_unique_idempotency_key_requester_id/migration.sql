/*
  Warnings:

  - A unique constraint covering the columns `[requesterId,idempotencyKey]` on the table `payment_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotencyKey` to the `payment_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_requests" ADD COLUMN     "idempotencyKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payment_requests_requesterId_idempotencyKey_key" ON "payment_requests"("requesterId", "idempotencyKey");
