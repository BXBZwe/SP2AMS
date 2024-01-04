/*
  Warnings:

  - A unique constraint covering the columns `[statusDetailsId]` on the table `RoomBaseDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `statusDetailsId` to the `RoomBaseDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_room_id_fkey";

-- DropForeignKey
ALTER TABLE "RoomStatusDetails" DROP CONSTRAINT "RoomStatusDetails_room_id_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "bills" DROP CONSTRAINT "bills_room_id_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "meter_readings" DROP CONSTRAINT "meter_readings_room_id_fkey";

-- DropForeignKey
ALTER TABLE "room_rates" DROP CONSTRAINT "room_rates_rate_id_fkey";

-- DropForeignKey
ALTER TABLE "room_rates" DROP CONSTRAINT "room_rates_room_id_fkey";

-- DropForeignKey
ALTER TABLE "service_contacts" DROP CONSTRAINT "service_contacts_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_room_id_fkey";

-- AlterTable
ALTER TABLE "RoomBaseDetails" ADD COLUMN     "statusDetailsId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RoomBaseDetails_statusDetailsId_key" ON "RoomBaseDetails"("statusDetailsId");

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_rates" ADD CONSTRAINT "room_rates_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rates"("rate_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_rates" ADD CONSTRAINT "room_rates_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomBaseDetails" ADD CONSTRAINT "RoomBaseDetails_statusDetailsId_fkey" FOREIGN KEY ("statusDetailsId") REFERENCES "RoomStatusDetails"("status_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_contacts" ADD CONSTRAINT "service_contacts_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "manager"("manager_id") ON DELETE CASCADE ON UPDATE CASCADE;
