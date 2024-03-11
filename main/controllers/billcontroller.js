import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const calculateAndGenerateBill = async (req, res) => {
    const { room_id } = req.body;

    // Helper function to update or insert the current year's sequence in the BillSequence table
    const updateBillSequence = async (year) => {
        let billSequence = await prisma.billSequence.findUnique({
            where: { year }
        });

        if (billSequence) {
            // If a sequence exists for the current year, increment it
            billSequence = await prisma.billSequence.update({
                where: { year },
                data: { last_sequence: { increment: 1 } }
            });
        } else {
            // If no sequence exists for the current year, start a new one
            billSequence = await prisma.billSequence.create({
                data: { year, last_sequence: 1 }
            });
        }

        return billSequence.last_sequence;
    };

    const generatedBill = await prisma.generatedBillRecord.findFirst({
        where: { room_id: parseInt(room_id) },
        orderBy: { generation_date: 'desc' },
    });

    // Generate billing number using the year and sequence number
    const generateBillingNumber = async (billingDate) => {
        // const billingYear = billingDate.getFullYear();
        const billingYear = generatedBill.generation_date.getFullYear();
        const sequenceNumber = await updateBillSequence(billingYear);
        return `${billingYear}/${sequenceNumber.toString().padStart(4, '0')}`;
    };

    try {
        // Your existing logic to calculate waterCost, electricityCost, additionalRatesCost...
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
                room_id: room_id,
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
            return acc + ((item.rates.item_price * item.quantity) + (item.rates.item_price * (item.rates.VAT_Percentage / 100)));
        }, 0);


        if (!generatedBill) {
            throw new Error('No generated bill record found for this room.');
        }

        console.log("Water Cost:", waterCost);
        console.log("Electricity Cost:", electricityCost);
        console.log("Additional Rates Cost:", additionalRatesCost);
        console.log("Room Base Rent:", roombaserent)
        console.log("Total Amount:", Number(waterCost) + Number(electricityCost) + Number(additionalRatesCost) + Number(roombaserent));


        const billingDate = new Date(); // Assuming the billing date is the current date. Adjust as needed.
        const billingNumber = await generateBillingNumber(billingDate); // Generate billing number using billingDate

        const newBill = await prisma.bills.create({
            data: {
                room_id: parseInt(room_id),
                water_usage: waterUsage,
                electricity_usage: electricityUsage,
                water_cost: waterCost,
                electricity_cost: electricityCost,
                additional_rates_cost: additionalRatesCost,
                total_amount: Number(waterCost) + Number(electricityCost) + Number(additionalRatesCost) + Number(roombaserent),
                billing_date: generatedBill.generation_date,
                baserent_month: generatedBill.rent_month,
                baserent_year: generatedBill.rent_year,
                billing_number: billingNumber, // Set the generated billing number here
            },
        });

        // Your existing logic to update the generatedBillRecord...
        await prisma.generatedBillRecord.update({
            where: { bill_record_id: generatedBill.bill_record_id },
            data: { bill_id: newBill.bill_id },
        });

        res.status(200).json({ message: 'Bill created successfully.', billdetails: newBill });
    } catch (error) {
        console.error('Error in calculateAndGenerateBill:', error);
        res.status(500).json({ error: error.message });
    }
};

export { calculateAndGenerateBill };
