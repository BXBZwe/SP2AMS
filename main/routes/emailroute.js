import express from 'express';
import { Emailsender,InvoiceEmailSender } from '../controllers/emailcontroller';

const emailroute = express.Router();

emailroute.post('/sendemail', Emailsender);
emailroute.post('/sendemail-invoice', InvoiceEmailSender);


export default emailroute;
