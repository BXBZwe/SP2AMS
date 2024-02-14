/*
  Warnings:

  - Added the required column `resolved_date` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "resolved_date" TIMESTAMP(3) NOT NULL;
