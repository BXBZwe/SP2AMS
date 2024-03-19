import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getbillingdetails = async (req, res) => {
    try {
        const { generationDate } = req.query;

        const billRecords = await prisma.generatedBillRecord.findMany({
            where: {
                generation_date: new Date(generationDate),
            },
            include: {
                RoomBaseDetails: {
                    include: {
                        tenants: true,
                        // bills: true,
                    },
                },
                Bill: true,
            },
        });

        const paymentDetails = billRecords.map(record => {
            const activeTenancy = record.RoomBaseDetails.tenancy_records[0];
            const tenant = activeTenancy ? activeTenancy.tenants : null;
            const bill = record.Bill;

            return {
                room_id: record.RoomBaseDetails.room_id,
                room_number: record.RoomBaseDetails.room_number,
                tenant_name: tenant ? `${tenant.first_name} ${tenant.last_name}` : 'N/A',
                total_bill: bill ? bill.total_amount : 'N/A',
                // payment_status: record.payment_status,
                // id: record.bill_record_id,
                // invoice_option: tenant ? tenant.invoice_option : 'N/A',
            };
        });

        res.status(200).json({ message: 'Payment Details retrieved successfully', paymentDetails });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).send(error.message);
    }
};

export { getbillingdetails };