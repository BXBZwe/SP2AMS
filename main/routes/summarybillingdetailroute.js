import express from 'express';
import { getbillingdetails } from '../controllers/summarybillingdetailcontroller';

const summarybillingdetailroute = express.Router();

summarybillingdetailroute.get('/getbillingdetails', getbillingdetails);


export default summarybillingdetailroute;
