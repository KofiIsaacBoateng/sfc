/*
  Warnings:

  - Added the required column `totalAmount` to the `payment_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_requests" ADD COLUMN     "feeAmount" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "totalAmount" BIGINT NOT NULL;
