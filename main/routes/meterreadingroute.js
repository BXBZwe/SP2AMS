import express from 'express';
import { addMeterReading, getLastReadingBeforeDate } from '../controllers/meterreadingcontroller';

const meterreadingroute = express.Router();

meterreadingroute.post('/addreading', addMeterReading);

meterreadingroute.get('/getLastReadingBeforeDate/:room_id', getLastReadingBeforeDate);

export default meterreadingroute;
