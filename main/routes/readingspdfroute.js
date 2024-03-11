import express from 'express';
import { getMeterReportPDF } from '../controllers/readingspdfcontroller';

const readingpdfroute = express.Router();

readingpdfroute.get('/generateMeterReport', getMeterReportPDF);

export default readingpdfroute;