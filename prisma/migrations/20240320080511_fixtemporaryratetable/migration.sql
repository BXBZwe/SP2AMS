/*
  Warnings:

  - You are about to drop the column `generatedBillRecordBill_record_id` on the `TemporaryRateAdjustments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TemporaryRateAdjustments" DROP CONSTRAINT "TemporaryRateAdjustments_generatedBillRecordBill_record_id_fkey";

-- AlterTable
ALTER TABLE "TemporaryRateAdjustments" DROP COLUMN "generatedBillRecordBill_record_id";
