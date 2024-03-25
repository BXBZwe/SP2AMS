import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getGeneratedBillRecords = async (req, res) => {
    try {
        const billRecords = await prisma.generatedBillRecord.findMany({
            include: {
                RoomBaseDetails: true,
                Bill: true
            }
        });

        res.status(200).json({ message: 'Retrieved generated bill records successfully', billRecords });
    } catch (error) {
        console.error('Error retrieving generated bill records:', error);
        res.status(500).json({ error: error.message });
    }
};

const getGeneratedBillRecordById = async (req, res) => {
    const { bill_record_id } = req.params;

    try {
        const billRecord = await prisma.generatedBillRecord.findUnique({
            where: { bill_record_id: parseInt(bill_record_id) },
            include: {
                RoomBaseDetails: true,
                Bill: true
            }
        });

        if (billRecord) {
            res.status(200).json({ message: 'Retrieved generated bill record successfully', data: billRecord });
        } else {
            res.status(404).json({ message: 'Generated bill record not found' });
        }
    } catch (error) {
        console.error('Error retrieving generated bill record:', error);
        res.status(500).json({ error: error.message });
    }
};

const createGeneratedBillRecord = async (req, res) => {
    const { rent_month, room_id, rent_year, generation_date } = req.body;

    try {
        const roomExists = await prisma.roomBaseDetails.findUnique({
            where: { room_id },
        });

        if (!roomExists) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const newBillRecord = await prisma.generatedBillRecord.create({
            data: {
                generation_date,
                rent_month,
                rent_year,
                payment_status: "Null",
                RoomBaseDetails: {
                    connect: { room_id },
                },
            },
        });

        res.status(201).json({ message: 'Generated bill record created successfully', data: newBillRecord });
    } catch (error) {
        console.error('Error creating generated bill record:', error);
        res.status(500).json({ error: error.message });
    }
};


const updateGeneratedBillRecord = async (req, res) => {
    const { bill_record_id } = req.params;
    const updateData = req.body;

    try {
        const updatedBillRecord = await prisma.generatedBillRecord.update({
            where: { bill_record_id: parseInt(bill_record_id) },
            data: updateData
        });

        res.status(200).json({ message: 'Generated bill record updated successfully', data: updatedBillRecord });
    } catch (error) {
        console.error('Error updating generated bill record:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteGeneratedBillRecord = async (req, res) => {
    const { bill_record_id } = req.params;

    try {
        await prisma.generatedBillRecord.delete({
            where: { bill_record_id: parseInt(bill_record_id) }
        });

        res.status(200).json({ message: 'Generated bill record deleted successfully' });
    } catch (error) {
        console.error('Error deleting generated bill record:', error);
        res.status(500).json({ error: error.message });
    }
};

export {
    getGeneratedBillRecords,
    getGeneratedBillRecordById,
    createGeneratedBillRecord,
    updateGeneratedBillRecord,
    deleteGeneratedBillRecord
}; 
