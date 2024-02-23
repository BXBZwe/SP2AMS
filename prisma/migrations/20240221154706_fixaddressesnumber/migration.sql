/*
  Warnings:

  - You are about to drop the column `Number` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `addressnumber` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "Number",
ADD COLUMN     "addressnumber" VARCHAR(5) NOT NULL;
