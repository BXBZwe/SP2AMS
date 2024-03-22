-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "invoice_number" VARCHAR(20);

-- CreateTable
CREATE TABLE "InvoiceSequence" (
    "year" INTEGER NOT NULL,
    "last_sequence" INTEGER,

    CONSTRAINT "InvoiceSequence_pkey" PRIMARY KEY ("year")
);
