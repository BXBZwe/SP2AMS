import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const calculateAndGenerateBill = async (req, res) => {
    const { room_id } = req.body;

    try {
        const meterReadings = await prisma.meter_readings.findMany({
            where: { room_id: parseInt(room_id) },
            orderBy: { reading_date: 'desc' },
            take: 2,
        });

        console.log("Meter Readings:", meterReadings);

        if (meterReadings.length < 2) {
            throw new Error('Insufficient meter readings to calculate bill.');
        }

        const [currentReading, previousReading] = meterReadings;

        const waterUsage = currentReading.water_reading - previousReading.water_reading;
        const electricityUsage = currentReading.electricity_reading - previousReading.electricity_reading;
        console.log("water usage:", waterUsage)
        console.log("electricity usage:", electricityUsage)


        const waterRateId = 3;
        const electricityRateId = 4;
        const rates = await prisma.rates.findMany({
            where: {
                rate_id: {
                    in: [waterRateId, electricityRateId],
                },
            },
        });

        const waterRate = rates.find(rates => rates.rate_id === waterRateId).item_price;
        const electricityRate = rates.find(rates => rates.rate_id === electricityRateId).item_price;

        const waterCost = waterUsage * waterRate;
        const electricityCost = electricityUsage * electricityRate;

        const room_rates = await prisma.room_rates.findMany({
            where: { room_id: parseInt(room_id) },
            include: { rates: true },
        });

        const additionalRatesCost = room_rates.reduce((acc, item) => {
            return acc + (item.rates.item_price * item.quantity);
        }, 0);


        const generatedBill = await prisma.generatedBillRecord.findFirst({
            where: { room_id: parseInt(room_id) },
            orderBy: { generation_date: 'desc' },
        });

        if (!generatedBill) {
            throw new Error('No generated bill record found for this room.');
        }

        const newBill = await prisma.bills.create({
            data: {
                room_id: parseInt(room_id),
                water_usage: waterUsage,
                electricity_usage: electricityUsage,
                water_cost: waterCost,
                electricity_cost: electricityCost,
                additional_rates_cost: additionalRatesCost,
                total_amount: waterCost + electricityCost + additionalRatesCost,
                billing_date: new Date(),
                baserent_month: generatedBill.rent_month,
                baserent_year: generatedBill.rent_year,
            },
        });

        await prisma.generatedBillRecord.update({
            where: { bill_record_id: generatedBill.bill_record_id },
            data: { bill_id: newBill.bill_id },
        });

        res.status(200).json({ message: 'bill created successfully.', billdetails: newBill });
    } catch (error) {
        console.error('Error in calculateAndGenerateBill:', error);
        res.status(500).json({ error: error.message });
    }
};

export { calculateAndGenerateBill };

