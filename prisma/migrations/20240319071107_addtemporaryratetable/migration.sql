-- CreateTable
CREATE TABLE "TemporaryRateAdjustments" (
    "temp_adjustment_id" SERIAL NOT NULL,
    "rate_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "bill_record_id" INTEGER NOT NULL,
    "temporary_price" DECIMAL(10,2) NOT NULL,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(3),

    CONSTRAINT "TemporaryRateAdjustments_pkey" PRIMARY KEY ("temp_adjustment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryRateAdjustments_rate_id_room_id_bill_record_id_key" ON "TemporaryRateAdjustments"("rate_id", "room_id", "bill_record_id");

-- AddForeignKey
ALTER TABLE "TemporaryRateAdjustments" ADD CONSTRAINT "TemporaryRateAdjustments_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rates"("rate_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryRateAdjustments" ADD CONSTRAINT "TemporaryRateAdjustments_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryRateAdjustments" ADD CONSTRAINT "TemporaryRateAdjustments_bill_record_id_fkey" FOREIGN KEY ("bill_record_id") REFERENCES "GeneratedBillRecord"("bill_record_id") ON DELETE RESTRICT ON UPDATE CASCADE;
