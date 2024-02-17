import express from 'express';
import { calculateAndGenerateBill } from '../controllers/billcontroller';

const billroute = express.Router();

billroute.post("/calculateandgeneratebill", calculateAndGenerateBill);

export default billroute;