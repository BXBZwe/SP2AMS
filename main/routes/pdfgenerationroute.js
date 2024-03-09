import express from 'express';
import { generateDocDefinition, createPdfDefinition } from '../controllers/pdfcontroller';
import PdfPrinter from 'pdfmake';

const pdfroute = express.Router();

const fonts = {
    Roboto: {
        normal: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Regular.ttf',
        bold: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Medium.ttf',
        italics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Italic.ttf',
        bolditalics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-MediumItalic.ttf'
    }
};
pdfroute.post('/generate-pdf', async (req, res) => {
    const { room_id } = req.body;

    try {
        const { roomDetails, managerName } = await createPdfDefinition(room_id);
        if (!roomDetails) {
            return res.status(404).send('Room details not found.');
        }

        const pdfDoc = generateDocDefinition(roomDetails, managerName, fonts);
        const pdfChunks = [];

        pdfDoc.on('data', (chunk) => pdfChunks.push(chunk));

        pdfDoc.on('end', () => {
            const result = Buffer.concat(pdfChunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=payment_slip_${room_id}.pdf`);
            res.send(result);
        });

        pdfDoc.end();
    } catch (error) {
        console.error('Error in PDF generation:', error);
        res.status(500).send(error.message);
    }
});

export default pdfroute;
