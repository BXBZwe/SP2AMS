-- AlterTable
ALTER TABLE "meter_readings" ALTER COLUMN "water_reading" DROP NOT NULL,
ALTER COLUMN "electricity_reading" DROP NOT NULL;
