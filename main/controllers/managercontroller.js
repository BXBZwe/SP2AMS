import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';

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


// const findManagerByName = async (name) => {
//     try {
//         const manager = await prisma.manager.findUnique({
//             where: { name: name },
//         });
//         return manager;
//     } catch (error) {
//         console.error('Error finding manager by name:', error);
//         throw error;
//     }
// };

// // Validate the manager's password
// const validateManagerPassword = async (inputPassword, storedPasswordHash) => {
//     try {
//         const isValid = await bcrypt.compare(inputPassword, storedPasswordHash);
//         return isValid;
//     } catch (error) {
//         console.error('Error validating manager password:', error);
//         throw error;
//     }
// };


export { getManager };