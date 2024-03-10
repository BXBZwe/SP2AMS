import express from 'express';
import { fetchBillingReport, generatePeriodicReportPDF } from '../controllers/periodicbillingreportcontroller';

const billingReportRoute = express.Router();

billingReportRoute.get('/billing-report', async (req, res) => {
    const { from, to } = req.query;
    try {
        const reportData = await fetchBillingReport(from, to);
        res.json(reportData);
    } catch (error) {
        console.error('Failed to fetch billing report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

billingReportRoute.get('/generate-periodic-report-pdf/:from/:to', generatePeriodicReportPDF);


export default billingReportRoute;