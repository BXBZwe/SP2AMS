import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPaymentDetails = async (req, res) => {
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
            const tenant = record.RoomBaseDetails.tenants[0];
            const bill = record.Bill;

            return {
                room_id: record.RoomBaseDetails.room_id,
                room_number: record.RoomBaseDetails.room_number,
                tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                total_bill: bill ? bill.total_amount : 'N/A',
                payment_status: record.payment_status,
                id: record.bill_record_id
            };
        });

        res.status(200).json({ message: 'Payment Details retrieved successfully', paymentDetails });
        console.log("Payment Details:", paymentDetails);

    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).send(error.message);
    }
}

const getgenerationdate = async (req, res) => {
    try {
        const generationDates = await prisma.generatedBillRecord.findMany({
            select: {
                generation_date: true,
            },
            distinct: ['generation_date'],
            orderBy: {
                generation_date: 'desc',
            },
        });

        const dates = generationDates.map(record => record.generation_date);
        console.log("generation dates:", dates);
        res.status(200).json({ message: 'Genenration dates retrieved successfully', dates });
    } catch (error) {
        console.error('Error fetching generation dates:', error);
        res.status(500).send(error.message);
    }
}
export { getPaymentDetails, getgenerationdate };