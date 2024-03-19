import express from 'express';
import { getbillingdetails, getRoomBillingDetails } from '../controllers/summarybillingdetailcontroller';

const summarybillingdetailroute = express.Router();

summarybillingdetailroute.get('/getbillingdetails', getbillingdetails);

summarybillingdetailroute.get('/getroombillingdetailforonegenerationdate/:room_id', getRoomBillingDetails);

export default summarybillingdetailroute;
