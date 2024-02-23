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


const addmanager = async (req, res) => {
    const manager_image = req.files['profile_image'] ? req.files['profile_image'][0].path : null;

    try {
        const newmanager = await prisma.manager.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password_hash: req.body.password_hash,
                phone_number: req.body.phone_number,
                profile_image: manager_image
            },
        });
        res.status(200).json({ message: 'Added a new manager successfully', newmanager });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
export { getManager, addmanager };