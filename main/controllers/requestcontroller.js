// controllers/requestController.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// Get all requests items
const getRequests = async (req, res) => {
    try {
        const getRequests = await prisma.request.findMany({
            include: {
                roomBaseDetails: true, 
            },
        });
        res.status(200).json({ message: 'Get request items successfully', getRequests });
    } catch (error) {
        console.error('Error fetching request items:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get each request
const getEachRequest = async (req, res) => {
    const { request_id } = req.params;
    try {
        const requestItem = await prisma.request.findUnique({
            where: { request_id: parseInt(request_id) },
            include: {
                roomBaseDetails: true,
            },
        });
        if (requestItem) {
            res.status(200).json({ message: 'Request item retrieved successfully', requestItem });
        } else {
            res.status(404).json({ message: 'Request item not found' });
        }
    } catch (error) {
        console.error('Error fetching request item:', error);
        res.status(500).json({ error: error.message });
    }
};

// POST - Create a new request
const createRequest = async (req, res) => {
    const {
        room_id,
        request_details,
        Request_priority,
        Request_status
    } = req.body;

    try {
        // Ensure room_id is a valid number
        const roomId = parseInt(room_id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: 'Invalid room ID' });
        }

        // Check if the room exists
        const roomExists = await prisma.roomBaseDetails.findUnique({
            where: {
                room_id: roomId
            }
        });

        if (!roomExists) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const newRequest = await prisma.request.create({
            data: {
                room_id: roomId,
                request_details,
                Request_priority,
                Request_status
            }
        });

        res.status(201).json({ message: 'Request created successfully', data: newRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: error.message });
    }
};


// Update Request
const updateRequest = async (req, res) => {
    const { request_id } = req.params;
    const { request_details, Request_priority, Request_status,resolved_date } = req.body;
    try {
        const updatedRequest = await prisma.request.update({
            where: { request_id: parseInt(request_id) },
            data: {
                request_details,
                Request_priority,
                Request_status,
                resolved_date: resolved_date ? new Date(resolved_date) : null,
            },
        });
        res.status(200).json({ message: 'Request item updated successfully', updatedRequest });
    } catch (error) {
        console.error('Error updating request item:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Request
const deleteRequest = async (req, res) => {
    const { request_id } = req.params;
    try {
        await prisma.request.delete({
            where: { request_id: parseInt(request_id) },
        });
        res.status(200).json({ message: 'Request item deleted successfully' });
    } catch (error) {
        console.error('Error deleting request item:', error);
        // Handle possible foreign key constraint failure
        if (error.code === 'P2003') {
            res.status(409).json({ message: 'Cannot delete request item due to dependencies' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};







export {getRequests,getEachRequest,createRequest,deleteRequest,updateRequest}
