import express from 'express';
import { calculateAndGenerateBill,UpdatePaymentStatus,UpdateAllPaymentStatus } from '../controllers/billcontroller';

const billroute = express.Router();

billroute.post("/calculateandgeneratebill", calculateAndGenerateBill);
billroute.put("/updatepaymentstatus", UpdatePaymentStatus);
billroute.put("/updateallpaymentstatus", UpdateAllPaymentStatus);


export default billroute;