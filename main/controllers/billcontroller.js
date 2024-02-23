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

        const roomdetails = await prisma.roomBaseDetails.findUnique({
            where: { room_id: parseInt(room_id) },
        })

        console.log("Meter Readings:", meterReadings);

        let previousReading = { water_reading: 0, electricity_reading: 0 };
        let currentReading;

        if (meterReadings.length === 0) {
            return res.status(400).json({ message: 'No meter readings found for this room.' });
        } else if (meterReadings.length === 1) {
            currentReading = meterReadings[0];
        } else {
            [currentReading, previousReading] = meterReadings;
        }

        console.log("Current Reading: ", currentReading);
        console.log("Previous Reading:", previousReading);

        const waterUsage = Math.abs(currentReading.water_reading - previousReading.water_reading);
        const electricityUsage = Math.abs(currentReading.electricity_reading - previousReading.electricity_reading);
        console.log("water usage:", waterUsage)
        console.log("electricity usage:", electricityUsage)


        const waterRateDetails = await prisma.rates.findFirst({
            where: { item_name: 'Water' },
        });

        const electricityRateDetails = await prisma.rates.findFirst({
            where: { item_name: 'Electricity' },
        });

        if (!waterRateDetails || !electricityRateDetails) {
            return res.status(404).json({ message: 'Water or electricity rates not found' });
        }

        const waterRate = waterRateDetails.item_price;
        const electricityRate = electricityRateDetails.item_price;

        console.log("Water Rate:", waterRate);
        console.log("Electricity Rate:", electricityRate);

        const waterCost = waterUsage * waterRate;
        const electricityCost = electricityUsage * electricityRate;

        const roombaserent = roomdetails.base_rent;

        const excludeRateNames = ['Water', 'Electricity'];

        const room_rates = await prisma.room_rates.findMany({
            where: {
                room_id: 19,
                rates: {
                    NOT: {
                        item_name: {
                            in: excludeRateNames,
                        },
                    },
                },
            },
            include: {
                rates: true,
            },
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

        console.log("Water Cost:", waterCost);
        console.log("Electricity Cost:", electricityCost);
        console.log("Additional Rates Cost:", additionalRatesCost);
        console.log("Room Base Rent:", roombaserent)
        console.log("Total Amount:", Number(waterCost) + Number(electricityCost) + Number(additionalRatesCost) + Number(roombaserent));

        const newBill = await prisma.bills.create({
            data: {
                room_id: parseInt(room_id),
                water_usage: waterUsage,
                electricity_usage: electricityUsage,
                water_cost: waterCost,
                electricity_cost: electricityCost,
                additional_rates_cost: additionalRatesCost,
                total_amount: Number(waterCost) + Number(electricityCost) + Number(additionalRatesCost) + Number(roombaserent),
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

