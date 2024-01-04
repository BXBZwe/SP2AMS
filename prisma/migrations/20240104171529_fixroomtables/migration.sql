/*
  Warnings:

  - You are about to drop the column `room_id` on the `RoomStatusDetails` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "RoomStatusDetails_room_id_key";

-- AlterTable
ALTER TABLE "RoomStatusDetails" DROP COLUMN "room_id";
