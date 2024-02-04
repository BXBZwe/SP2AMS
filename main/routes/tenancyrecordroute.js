import express from 'express';
import {checkIn, checkOut} from '../controllers/tenantrecordcontroller';

const tenancyrecordsroute = express.Router();

tenancyrecordsroute.post('/checkintenant', checkIn);


export default tenancyrecordsroute;
