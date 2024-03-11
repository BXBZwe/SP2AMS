import express from 'express';
import { fetchAccrualReport, generateAccrualReportPDF } from '../controllers/accuralbillingreportcontroller';

const accuralroute = express.Router();

accuralroute.get('/accrual-report/:year', async (req, res) => {
    const year = parseInt(req.params.year);
    try {
        const reportData = await fetchAccrualReport(year);
        res.json(reportData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

accuralroute.get('/generateaccuralbillingreport/:year', generateAccrualReportPDF);


export default accuralroute;
