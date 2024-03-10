import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addMeterReading = async (req, res) => {
    const { room_id, water_reading, meter_reading, reading_date } = req.body;
    try {
        const parsedRoomId = parseInt(room_id, 10);
        const parsedReadingDate = new Date(reading_date);
        console.log("parsed Reading date:", parsedReadingDate);

        const newData = {
            room_id: parsedRoomId,
            reading_date: parsedReadingDate,
        };

        if (water_reading !== undefined) {
            newData.water_reading = parseInt(water_reading, 10);
        }
        if (meter_reading !== undefined) {
            newData.electricity_reading = parseInt(meter_reading, 10);
        }

        const existingRecord = await prisma.meter_readings.findFirst({
            where: {
                room_id: parsedRoomId,
                reading_date: parsedReadingDate
            }
        });

        if (existingRecord) {
            await prisma.meter_readings.update({
                where: { reading_id: existingRecord.reading_id },
                data: newData
            });
        } else {
            await prisma.meter_readings.create({ data: newData });
        }

        res.status(200).json({ message: 'Meter reading updated successfully.' });
    } catch (error) {
        console.error('Error in addOrUpdateMeterReading:', error);
        res.status(500).json({ error: error.message });
    }
};


const getLastReadingBeforeDate = async (req, res) => {
    const { room_id } = req.params;
    const { generation_date } = req.query;

    if (!generation_date || isNaN(Date.parse(generation_date))) {
        return res.status(400).json({ error: 'Invalid generation_date provided.' });
    }

    try {
        const previousReading = await prisma.meter_readings.findFirst({
            where: {
                room_id: parseInt(room_id, 10),
                reading_date: {
                    lt: new Date(generation_date)
                }
            },
            orderBy: {
                reading_date: 'desc',
            },
        });

        if (!previousReading) {
            return res.json({ data: { water_reading: 0, electricity_reading: 0 } });
        }

        res.status(200).json({ message: 'Previous reading fetched successfully', data: previousReading });
    } catch (error) {
        console.error('Error fetching previous reading:', error);
        res.status(500).json({ error: error.message });
    }
};

const getCurrentReading = async (req, res) => {
    const { room_id } = req.params;
    const { generation_date } = req.query;

    if (!generation_date || isNaN(Date.parse(generation_date))) {
        return res.status(400).json({ error: 'Invalid generation_date provided.' });
    }

    try {
        const currentReading = await prisma.meter_readings.findFirst({
            where: {
                room_id: parseInt(room_id, 10),
                reading_date: {
                    lte: new Date(generation_date)
                }
            },
            orderBy: {
                reading_date: 'desc',
            },
        });

        if (!currentReading) {
            return res.json({ data: { water_reading: 0, electricity_reading: 0 } });
        }

        res.status(200).json({ message: 'Current reading fetched successfully', data: currentReading });
    } catch (error) {
        console.error('Error fetching current reading:', error);
        res.status(500).json({ error: error.message });
    }
};


export { addMeterReading, getLastReadingBeforeDate, getCurrentReading };
