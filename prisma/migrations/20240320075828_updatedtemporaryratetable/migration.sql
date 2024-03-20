/*
  Warnings:

  - You are about to drop the column `bill_record_id` on the `TemporaryRateAdjustments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rate_id,room_id,bill_id]` on the table `TemporaryRateAdjustments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bill_id` to the `TemporaryRateAdjustments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TemporaryRateAdjustments" DROP CONSTRAINT "TemporaryRateAdjustments_bill_record_id_fkey";

-- DropIndex
DROP INDEX "TemporaryRateAdjustments_rate_id_room_id_bill_record_id_key";

-- AlterTable
ALTER TABLE "TemporaryRateAdjustments" DROP COLUMN "bill_record_id",
ADD COLUMN     "bill_id" INTEGER NOT NULL,
ADD COLUMN     "generatedBillRecordBill_record_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryRateAdjustments_rate_id_room_id_bill_id_key" ON "TemporaryRateAdjustments"("rate_id", "room_id", "bill_id");

-- AddForeignKey
ALTER TABLE "TemporaryRateAdjustments" ADD CONSTRAINT "TemporaryRateAdjustments_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("bill_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryRateAdjustments" ADD CONSTRAINT "TemporaryRateAdjustments_generatedBillRecordBill_record_id_fkey" FOREIGN KEY ("generatedBillRecordBill_record_id") REFERENCES "GeneratedBillRecord"("bill_record_id") ON DELETE SET NULL ON UPDATE CASCADE;
