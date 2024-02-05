/*
  Warnings:

  - You are about to drop the column `payment_status` on the `RoomStatusDetails` table. All the data in the column will be lost.
  - You are about to drop the column `deposit_returned` on the `tenancy_records` table. All the data in the column will be lost.
  - You are about to drop the column `payment_option` on the `tenants` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InvoiceOption" AS ENUM ('EMAIL', 'PAPER', 'BOTH');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContractStatus" ADD VALUE 'CHECKED_OUT';
ALTER TYPE "ContractStatus" ADD VALUE 'TERMINATED';

-- AlterTable
ALTER TABLE "RoomStatusDetails" DROP COLUMN "payment_status";

-- AlterTable
ALTER TABLE "tenancy_records" DROP COLUMN "deposit_returned",
ADD COLUMN     "deposit" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "payment_option",
ADD COLUMN     "invoice_option" "InvoiceOption" NOT NULL DEFAULT 'EMAIL';

-- DropEnum
DROP TYPE "PaymentOption";
