import express from 'express';
import { getRooms } from '../controllers/roomcontroller';

const roomroute = express.Router();

roomroute.post('/getrooms', getRooms);

export default roomroute;
