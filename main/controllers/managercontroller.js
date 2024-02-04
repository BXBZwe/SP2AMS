import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET - Fetch the manager's details
const getManager = async (req, res) => {
    try {
        const manager = await prisma.manager.findFirst();

        if (!manager) {
            res.status(404).json({ message: 'Manager not found' });
        } else {
            res.status(200).json({ message: 'Manager fetched successfully', manager });
        }
    } catch (error) {
        console.error('Error fetching manager:', error);
        res.status(500).json({ error: error.message });
    }
};


export { getManager};