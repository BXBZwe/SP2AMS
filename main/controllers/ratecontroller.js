// controllers/rateController.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// Get all rate items
const getallRateItem = async(req, res) => {
    try{
        const getRate = await prisma.rates.findMany();
        res.status(200).json({message: 'Get rate items successfully', getRate});
    } catch (error){
        res.status(500).send(error.message);
    }
};

// Add a new rate item
const addRateItem = async (req, res) => {
    const { item_name, item_price, item_description } = req.body;

    try {
        const newRate = await prisma.rates.create({
            data: {
                item_name,
                item_price,
                item_description
            }
        });
        res.status(201).json({ message: 'New rate item added successfully', data: newRate });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update an existing rate item
const updateRateItem = async (req, res) => {
    const { rate_id } = req.params;
    const { item_name, item_price, item_description } = req.body;

    try {
        const updatedRate = await prisma.rates.update({
            where: { rate_id: parseInt(rate_id) },
            data: {
                item_name,
                item_price,
                item_description,
                last_updated: new Date()
            }
        });
        res.status(200).json({ message: 'Rate item updated successfully', data: updatedRate });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Delete a rate item
const deleteRateItem = async (req, res) => {
    const { rate_id } = req.params;

    try {
        await prisma.rates.delete({
            where: { rate_id: parseInt(rate_id) },
        });
        res.status(200).json({ message: 'Rate item deleted successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export { getallRateItem, addRateItem, updateRateItem, deleteRateItem };
