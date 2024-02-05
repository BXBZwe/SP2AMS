import express from 'express';
import { checkIn, checkOut, getaTenancyrecord } from '../controllers/tenantrecordcontroller';

const tenancyrecordsroute = express.Router();

tenancyrecordsroute.post('/checkintenant', checkIn);

tenancyrecordsroute.post('/checkouttenant', checkOut);

tenancyrecordsroute.get('/geteachtenancyrecord/:roomId', getaTenancyrecord);

export default tenancyrecordsroute;
