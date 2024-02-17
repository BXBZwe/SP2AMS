/*
  Warnings:

  - Added the required column `Number` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "Number" VARCHAR(5) NOT NULL;
