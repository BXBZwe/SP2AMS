import express from 'express';
import { calculateAndGenerateBill,UpdatePaymentStatus } from '../controllers/billcontroller';

const billroute = express.Router();

billroute.post("/calculateandgeneratebill", calculateAndGenerateBill);
billroute.put("/updatepaymentstatus", UpdatePaymentStatus);


export default billroute;