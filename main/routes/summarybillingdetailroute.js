import express from 'express';
import { getbillingdetails, getRoomBillingDetails, applyTemporaryRateAdjustment } from '../controllers/summarybillingdetailcontroller';

const summarybillingdetailroute = express.Router();

summarybillingdetailroute.get('/getbillingdetails', getbillingdetails);

summarybillingdetailroute.get('/getroombillingdetailforonegenerationdate/:room_id', getRoomBillingDetails);

summarybillingdetailroute.post('/applytemporaryRateAdjustment', applyTemporaryRateAdjustment)

export default summarybillingdetailroute;
