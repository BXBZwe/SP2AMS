import express from 'express';
import { Emailsender } from '../controllers/emailcontroller';

const emailroute = express.Router();

emailroute.post('/sendemail', Emailsender);

export default emailroute;
