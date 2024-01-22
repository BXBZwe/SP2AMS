import express from 'express';
import { createRoom, deleteRoom, getRooms, updateRoom,getEachRoom } from '../controllers/roomcontroller';

const roomroute = express.Router();

roomroute.get('/getallrooms', getRooms);

roomroute.get('/geteachroom/:room_id', getEachRoom);

roomroute.post('/addrooms', createRoom);

roomroute.put('/updaterooms/:room_id', updateRoom);

roomroute.delete('/deleterooms/:room_id', deleteRoom);

export default roomroute;
