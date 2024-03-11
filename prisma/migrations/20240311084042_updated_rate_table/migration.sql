/*
  Warnings:

  - You are about to drop the column `Bill` on the `rates` table. All the data in the column will be lost.
  - You are about to drop the column `Meter` on the `rates` table. All the data in the column will be lost.
  - You are about to drop the column `Payment` on the `rates` table. All the data in the column will be lost.
  - You are about to drop the column `Usage` on the `rates` table. All the data in the column will be lost.
  - You are about to drop the column `VAT` on the `rates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rates" DROP COLUMN "Bill",
DROP COLUMN "Meter",
DROP COLUMN "Payment",
DROP COLUMN "Usage",
DROP COLUMN "VAT",
ADD COLUMN     "VAT_Percentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "disable_rate" BOOLEAN NOT NULL DEFAULT false;
