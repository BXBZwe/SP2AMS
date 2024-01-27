/*
  Warnings:

  - The values [urgent,high,moderate,normal,low] on the enum `RequestPriority` will be removed. If these variants are still used in the database, this will fail.
  - The values [resolved,unresolved] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `base_rent` on the `RoomBaseDetails` table. All the data in the column will be lost.
  - You are about to drop the column `is_available_for_rent` on the `RoomStatusDetails` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the `check_ins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `check_outs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payment_option` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TenancyStatus" AS ENUM ('CHECK_IN', 'CHECK_OUT');

-- CreateEnum
CREATE TYPE "PaymentOption" AS ENUM ('EMAIL', 'PAPER', 'BOTH');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('NEW', 'ONGOING', 'DUE', 'WARNING');

-- AlterEnum
BEGIN;
CREATE TYPE "RequestPriority_new" AS ENUM ('URGENT', 'HIGH', 'MODERATE', 'NORMAL', 'LOW');
ALTER TABLE "Request" ALTER COLUMN "Request_priority" TYPE "RequestPriority_new" USING ("Request_priority"::text::"RequestPriority_new");
ALTER TYPE "RequestPriority" RENAME TO "RequestPriority_old";
ALTER TYPE "RequestPriority_new" RENAME TO "RequestPriority";
DROP TYPE "RequestPriority_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('RESOLVED', 'UNRESOLVED');
ALTER TABLE "Request" ALTER COLUMN "Request_status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "Request_status" TYPE "RequestStatus_new" USING ("Request_status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
ALTER TABLE "Request" ALTER COLUMN "Request_status" SET DEFAULT 'UNRESOLVED';
COMMIT;

-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_room_id_fkey";

-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "check_outs" DROP CONSTRAINT "check_outs_room_id_fkey";

-- DropForeignKey
ALTER TABLE "check_outs" DROP CONSTRAINT "check_outs_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_room_id_fkey";

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "Request_status" SET DEFAULT 'UNRESOLVED';

-- AlterTable
ALTER TABLE "RoomBaseDetails" DROP COLUMN "base_rent";

-- AlterTable
ALTER TABLE "RoomStatusDetails" DROP COLUMN "is_available_for_rent";

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "room_id",
ADD COLUMN     "account_status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "contract_status" "ContractStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "payment_option" "PaymentOption" NOT NULL,
ADD COLUMN     "roomBaseDetailsRoom_id" INTEGER;

-- DropTable
DROP TABLE "check_ins";

-- DropTable
DROP TABLE "check_outs";

-- CreateTable
CREATE TABLE "GeneratedBillRecord" (
    "bill_record_id" SERIAL NOT NULL,
    "generation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rent_month" TEXT NOT NULL,
    "room_id" INTEGER NOT NULL,
    "rent_year" INTEGER NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "GeneratedBillRecord_pkey" PRIMARY KEY ("bill_record_id")
);

-- CreateTable
CREATE TABLE "tenancy_records" (
    "record_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "move_in_date" DATE NOT NULL,
    "move_out_date" DATE,
    "period_of_stay" INTEGER,
    "deposit_returned" DECIMAL(10,2),
    "tenancy_status" "TenancyStatus" NOT NULL DEFAULT 'CHECK_IN',

    CONSTRAINT "tenancy_records_pkey" PRIMARY KEY ("record_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedBillRecord_generation_date_room_id_key" ON "GeneratedBillRecord"("generation_date", "room_id");

-- AddForeignKey
ALTER TABLE "GeneratedBillRecord" ADD CONSTRAINT "GeneratedBillRecord_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GeneratedBillRecord" ADD CONSTRAINT "GeneratedBillRecord_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("bill_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tenancy_records" ADD CONSTRAINT "tenancy_records_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tenancy_records" ADD CONSTRAINT "tenancy_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_roomBaseDetailsRoom_id_fkey" FOREIGN KEY ("roomBaseDetailsRoom_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE SET NULL ON UPDATE CASCADE;
