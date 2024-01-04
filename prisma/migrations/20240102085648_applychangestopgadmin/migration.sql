-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'OVERDUE', 'PARTIAL');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('urgent', 'high', 'moderate', 'normal', 'low');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('resolved', 'unresolved');

-- CreateTable
CREATE TABLE "bills" (
    "bill_id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "water_usage" DECIMAL(10,2) NOT NULL,
    "water_cost" DECIMAL(10,2) NOT NULL,
    "electricity_usage" DECIMAL(10,2) NOT NULL,
    "electricity_cost" DECIMAL(10,2) NOT NULL,
    "additional_rates_cost" DECIMAL(10,2) NOT NULL,
    "billing_date" DATE NOT NULL,
    "baserent_month" VARCHAR(20) NOT NULL,
    "baserent_year" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "check_in_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "move_in_date" DATE NOT NULL,
    "period_of_stay" INTEGER NOT NULL,
    "deposit_paid" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("check_in_id")
);

-- CreateTable
CREATE TABLE "check_outs" (
    "check_out_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "move_out_date" DATE NOT NULL,
    "deposit_returned" DECIMAL(10,2) NOT NULL,
    "final_bill" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "check_outs_pkey" PRIMARY KEY ("check_out_id")
);

-- CreateTable
CREATE TABLE "manager" (
    "manager_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone_number" VARCHAR(20),
    "profile_image" BYTEA,

    CONSTRAINT "manager_pkey" PRIMARY KEY ("manager_id")
);

-- CreateTable
CREATE TABLE "meter_readings" (
    "reading_id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "water_reading" INTEGER NOT NULL,
    "electricity_reading" INTEGER NOT NULL,
    "reading_date" DATE NOT NULL,

    CONSTRAINT "meter_readings_pkey" PRIMARY KEY ("reading_id")
);

-- CreateTable
CREATE TABLE "rates" (
    "rate_id" SERIAL NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "item_price" DECIMAL(10,2) NOT NULL,
    "item_description" TEXT,
    "last_updated" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("rate_id")
);

-- CreateTable
CREATE TABLE "room_rates" (
    "room_id" INTEGER NOT NULL,
    "rate_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_rates_pkey" PRIMARY KEY ("room_id","rate_id")
);

-- CreateTable
CREATE TABLE "RoomBaseDetails" (
    "room_id" SERIAL NOT NULL,
    "room_number" VARCHAR(50) NOT NULL,
    "floor" INTEGER NOT NULL,
    "room_type" VARCHAR(50) NOT NULL,
    "base_rent" DECIMAL(10,2) NOT NULL,
    "deposit" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "RoomBaseDetails_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "RoomStatusDetails" (
    "status_id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "occupancy_status" VARCHAR(50) NOT NULL,
    "is_reserved" BOOLEAN NOT NULL DEFAULT false,
    "is_available_for_rent" BOOLEAN NOT NULL DEFAULT true,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RoomStatusDetails_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "tenant_id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "personal_id" VARCHAR(255) NOT NULL,
    "room_id" INTEGER NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "address_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "sub_district" VARCHAR(255) NOT NULL,
    "district" VARCHAR(255) NOT NULL,
    "province" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "contact_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "line_id" VARCHAR(255) NOT NULL,
    "eme_name" VARCHAR(255) NOT NULL,
    "eme_phone" VARCHAR(20) NOT NULL,
    "eme_line_id" VARCHAR(255) NOT NULL,
    "eme_relation" VARCHAR(255) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "Request" (
    "request_id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_details" TEXT NOT NULL,
    "Request_priority" "RequestPriority" NOT NULL,
    "Request_status" "RequestStatus" NOT NULL DEFAULT 'unresolved',

    CONSTRAINT "Request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "service_contacts" (
    "service_contact_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(255),
    "phone_number" VARCHAR(20) NOT NULL,
    "occupation" VARCHAR(255) NOT NULL,
    "line_id" VARCHAR(255) NOT NULL,
    "image" BYTEA NOT NULL,
    "manager_id" INTEGER NOT NULL,

    CONSTRAINT "service_contacts_pkey" PRIMARY KEY ("service_contact_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manager_email_key" ON "manager"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoomStatusDetails_room_id_key" ON "RoomStatusDetails"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_personal_id_key" ON "tenants"("personal_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_tenant_id_key" ON "addresses"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_tenant_id_key" ON "contacts"("tenant_id");

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "check_outs" ADD CONSTRAINT "check_outs_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "check_outs" ADD CONSTRAINT "check_outs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_rates" ADD CONSTRAINT "room_rates_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rates"("rate_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_rates" ADD CONSTRAINT "room_rates_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomStatusDetails" ADD CONSTRAINT "RoomStatusDetails_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomBaseDetails"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_contacts" ADD CONSTRAINT "service_contacts_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "manager"("manager_id") ON DELETE RESTRICT ON UPDATE CASCADE;
