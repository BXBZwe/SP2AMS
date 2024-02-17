import express from 'express';
import { getPaymentDetails, getgenerationdate } from '../controllers/paymentcontroller';

const paymentroute = express();

paymentroute.get("/getpaymentdetails", getPaymentDetails);

paymentroute.get("/getgenerationdate", getgenerationdate);

export default paymentroute;