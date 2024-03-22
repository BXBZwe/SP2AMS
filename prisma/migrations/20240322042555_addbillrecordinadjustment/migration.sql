-- AlterTable
ALTER TABLE "TemporaryRateAdjustments" ADD COLUMN     "bill_record_id" INTEGER;

-- AddForeignKey
ALTER TABLE "TemporaryRateAdjustments" ADD CONSTRAINT "TemporaryRateAdjustments_bill_record_id_fkey" FOREIGN KEY ("bill_record_id") REFERENCES "GeneratedBillRecord"("bill_record_id") ON DELETE SET NULL ON UPDATE CASCADE;
