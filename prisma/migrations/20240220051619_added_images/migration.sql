/*
  Warnings:

  - You are about to alter the column `profile_image` on the `manager` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.
  - You are about to alter the column `image` on the `service_contacts` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.
  - Made the column `profile_image` on table `manager` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `nationalcard_image` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nc_expirationdate` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nc_issuedate` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_image` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "manager" ALTER COLUMN "profile_image" SET NOT NULL,
ALTER COLUMN "profile_image" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "service_contacts" ALTER COLUMN "image" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "nationalcard_image" VARCHAR(255) NOT NULL,
ADD COLUMN     "nc_expirationdate" DATE NOT NULL,
ADD COLUMN     "nc_issuedate" DATE NOT NULL,
ADD COLUMN     "tenant_image" VARCHAR(255) NOT NULL;
