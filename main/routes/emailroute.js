import express from 'express';
import {Emailsender} from '../controllers/emailcontroller';

const emailroute = express.Router();

emailroute.post('/send-email', Emailsender);

export default emailroute;
