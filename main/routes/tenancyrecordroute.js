import express from 'express';
import { checkIn, checkOut, getaTenancyrecord, getAllTenancyRecords } from '../controllers/tenantrecordcontroller';

const tenancyrecordsroute = express.Router();

tenancyrecordsroute.post('/checkintenant', checkIn);

tenancyrecordsroute.post('/checkouttenant', checkOut);

tenancyrecordsroute.get('/geteachtenancyrecord/:roomId', getaTenancyrecord);

tenancyrecordsroute.get('/getalltenancyrecord', getAllTenancyRecords);

export default tenancyrecordsroute;
