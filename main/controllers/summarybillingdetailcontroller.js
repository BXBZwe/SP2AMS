import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getbillingdetails = async (req, res) => {
    try {
        const { generationDate } = req.query;

        const billRecords = await prisma.generatedBillRecord.findMany({
            where: {
                generation_date: new Date(generationDate)
            },
            include: {
                RoomBaseDetails: {
                    include: {
                        tenants: true,
                    }
                },
                Bill: true
            }
        });

        const paymentDetails = billRecords.map(record => {

            if (!record.RoomBaseDetails.tenants || record.RoomBaseDetails.tenants.length === 0) {
                console.log(`No tenants found for RoomBaseDetails ID: ${record.RoomBaseDetails.room_id}`);
                return {
                    room_id: record.RoomBaseDetails.room_id,
                    room_number: record.RoomBaseDetails.room_number,
                    tenant_name: 'No tenant',
                    total_bill: record.Bill ? record.Bill.total_amount : 'N/A',
                    // payment_status: record.payment_status,
                    id: record.bill_record_id,
                    // invoice_option: 'N/A'
                };
            }

            const tenant = record.RoomBaseDetails.tenants[0];
            const bill = record.Bill;

            return {
                room_id: record.RoomBaseDetails.room_id,
                room_number: record.RoomBaseDetails.room_number,
                tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                total_bill: bill ? bill.total_amount : 'N/A',
                payment_status: record.payment_status,
                id: record.bill_record_id,
                invoice_option: tenant.invoice_option
            };
        });

        res.status(200).json({ message: 'Payment Details retrieved successfully', paymentDetails });
        console.log("Payment Details:", paymentDetails);

    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).send(error.message);
    }
};

const getRoomBillingDetails = async (req, res) => {
    try {
        const { room_id } = req.params;

        const roomDetails = await prisma.roomBaseDetails.findUnique({
            where: {
                room_id: parseInt(room_id),
            },
            include: {
                tenancy_records: {
                    include: {
                        tenants: true,
                    },
                },
                bills: {
                    orderBy: {
                        billing_date: 'desc',
                    },
                    take: 1,
                },
                meter_readings: {
                    orderBy: {
                        reading_date: 'desc',
                    },
                    take: 1,
                },
                room_rates: {
                    include: {
                        rates: true,
                    },
                },
                generatedBillRecords: {
                    orderBy: {
                        generation_date: 'desc',
                    },
                    take: 1,
                },
            },
        });

        if (!roomDetails) {
            return res.status(404).json({ message: 'Room details not found' });
        }

        const activeTenant = roomDetails.tenancy_records[0]?.tenants || null;
        const billDetails = roomDetails.bills[0] || null;
        const meterDetails = roomDetails.meter_readings[0] || null;
        const generatedBillRecord = roomDetails.generatedBillRecords[0] || null;

        const detailedBilling = {
            room_number: roomDetails.room_number,
            tenant_name: activeTenant ? `${activeTenant.first_name} ${activeTenant.last_name}` : 'No Tenant',
            generation_date: generatedBillRecord ? generatedBillRecord.generation_date : 'N/A',
            total_bill: billDetails ? billDetails.total_amount : 'N/A',
            items: roomDetails.room_rates.map(rate => ({
                item_name: rate.rates.item_name,
                per_unit_price: rate.rates.item_price,
                quantity: rate.quantity,
                total: rate.quantity * rate.rates.item_price,
                last_updated: rate.rates.last_updated,
            })),
            meter_reading: {
                water_reading: meterDetails ? meterDetails.water_reading : 'N/A',
                electricity_reading: meterDetails ? meterDetails.electricity_reading : 'N/A',
                water_usage: billDetails ? billDetails.water_usage : 'N/A',
                water_cost: billDetails ? billDetails.water_cost : 'N/A',
                electricity_usage: billDetails ? billDetails.electricity_usage : 'N/A',
                electricity_cost: billDetails ? billDetails.electricity_cost : 'N/A',
                reading_date: meterDetails ? meterDetails.reading_date : 'N/A',
            },
        };

        res.status(200).json({ message: 'Room billing details retrieved successfully', detailedBilling });
    } catch (error) {
        console.error('Error fetching room billing details:', error);
        res.status(500).send(error.message);
    }
};

// Controller function to apply temporary rate adjustments
const applyTemporaryRateAdjustment = async (req, res) => {
    const { rate_id, room_id, bill_record_id, temporary_price } = req.body;

    try {
        // Here you would write logic to either create or update the temporary adjustment
        const adjustment = await prisma.temporaryRateAdjustments.upsert({
            where: {
                rate_id_room_id_bill_record_id: {
                    rate_id: rate_id,
                    room_id: room_id,
                    bill_record_id: bill_record_id,
                },
            },
            update: {
                temporary_price: temporary_price,
                applied: false, // set to false to indicate it hasn't been applied yet
                // Optionally update expiration_date if your logic requires
            },
            create: {
                rate_id: rate_id,
                room_id: room_id,
                bill_record_id: bill_record_id,
                temporary_price: temporary_price,
                applied: false, // set to false to indicate it hasn't been applied yet
                // Optionally set expiration_date if your logic requires
            },
        });

        return res.status(200).json({ message: 'Temporary rate adjustment applied successfully', adjustment });
    } catch (error) {
        console.error('Error applying temporary rate adjustment:', error);
        return res.status(500).json({ message: 'Error applying temporary rate adjustment', error });
    }
};


export { getbillingdetails, getRoomBillingDetails, applyTemporaryRateAdjustment };