-- AlterTable
ALTER TABLE "GeneratedBillRecord" ALTER COLUMN "generation_date" DROP DEFAULT,
ALTER COLUMN "bill_id" DROP NOT NULL;
