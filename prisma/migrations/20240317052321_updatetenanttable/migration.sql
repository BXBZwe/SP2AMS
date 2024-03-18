/*
  Warnings:

  - Added the required column `expiration_date` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issue_date` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "expiration_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" VARCHAR(10) NOT NULL,
ADD COLUMN     "issue_date" TIMESTAMP(3) NOT NULL;
