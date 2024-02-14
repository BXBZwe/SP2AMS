/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `manager` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "manager_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "manager_name_key" ON "manager"("name");
