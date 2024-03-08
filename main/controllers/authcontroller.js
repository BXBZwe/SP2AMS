import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await prisma.manager.findUnique({
            where: { name },
        });

        if (!user) {
            return res.status(401).json({ message: 'No such user found' });
        }

        if (password !== user.password_hash) {
            return res.status(401).json({ message: 'Password is incorrect' });
        }

        const { password_hash, ...userInfo } = user;

        res.json({ message: 'Login successful', user: userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}

export { login };

