import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET - Fetch all rooms with their status details
const getRooms = async (req, res) => {
    try {
        const getrooms = await prisma.roomBaseDetails.findMany({
            include: {
                statusDetails: true,  
            },
        });
        res.status(200).json({ message: 'Get all rooms successfully', getrooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET - Fetch one room with their status details
const getEachRoom = async (req, res) => {
    const { room_id } = req.params;
    try {
      const room = await prisma.roomBaseDetails.findUnique({
        where: { room_id: parseInt(room_id) },
        include: {
          statusDetails: true,
        },
      });
  
      if (!room) {
        // Handle the case where the room with the specified room_id is not found
        res.status(404).json({ message: 'Room not found' });
      } else {
        res.status(200).json({ message: 'Get room successfully', room });
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

// POST - Create a new room
const createRoom = async (req, res) => {
    try {
        const newRoom = await prisma.roomBaseDetails.create({
            data: {
                room_number: req.body.room_number,
                floor: req.body.floor,
                room_type: req.body.room_type,
                base_rent: req.body.base_rent,
                deposit: req.body.deposit,
                statusDetails:{
                    create: req.body.statusDetails,
                }
            },
            include: {
                statusDetails: true,
            }
        });
        res.status(200).json({ message: 'Added a new room successfully', newRoom });
    } catch (error) {
        console.error('Error creating new room:', error);
        res.status(500).json({ error: error.message });
    }
};

// PUT - Update a room's details
const updateRoom = async (req, res) => {
    const { room_id } = req.params; 
    try {
        const updatedRoom = await prisma.roomBaseDetails.update({
            where: { room_id: parseInt(room_id) },
            data: {
                room_number: req.body.room_number,
                floor: req.body.floor,
                room_type: req.body.room_type,
                base_rent: req.body.base_rent,
                deposit: req.body.deposit,
                statusDetails: {
                    update: req.body.statusDetails,
                },
            },
            include: {
                statusDetails: true,
            },
        });
        res.status(200).json({ message: 'Room updated successfully', data: updatedRoom });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE - Remove a room
const deleteRoom = async (req, res) => {
    const { room_id } = req.params;  
    try {
        await prisma.roomBaseDetails.delete({
            where: { room_id: parseInt(room_id) },
        });
        res.status(200).json({ message: 'Room Deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: error.message });
    }
};

export { getRooms, createRoom, updateRoom, deleteRoom,getEachRoom };
