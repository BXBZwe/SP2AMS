/*
  Warnings:

  - You are about to drop the column `nc_expirationdate` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `nc_issuedate` on the `tenants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "nc_expirationdate",
DROP COLUMN "nc_issuedate";
