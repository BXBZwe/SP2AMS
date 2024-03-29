/*
  Warnings:

  - Added the required column `email_key` to the `manager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "manager" ADD COLUMN     "email_key" TEXT NOT NULL;
