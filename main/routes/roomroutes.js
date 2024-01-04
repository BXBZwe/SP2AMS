import express from 'express';
import { createRoom, deleteRoom, getRooms, updateRoom } from '../controllers/roomcontroller';

const roomroute = express.Router();

roomroute.get('/getallrooms', getRooms);

roomroute.post('/addrooms', createRoom);

roomroute.put('/updaterooms/:room_id', updateRoom);

roomroute.delete('/deleterooms/:room_id', deleteRoom);

export default roomroute;
