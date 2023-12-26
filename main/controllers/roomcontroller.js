import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getRooms = async (req, res) => {
    try {
        // Fetch rooms using Prisma
        const rooms = await prisma.rooms.findMany({
            select: {
                room_id: true,
                room_number: true,
            },
        });
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: error.message });
    }
};

export { getRooms };
