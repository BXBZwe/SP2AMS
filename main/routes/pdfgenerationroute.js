// import express from 'express';
// import { generateDocDefinition, createPdfDefinition } from '../controllers/paymentpdfcontroller';

// const pdfroute = express.Router();

// const fonts = {
//     Roboto: {
//         normal: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Regular.ttf',
//         bold: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Medium.ttf',
//         italics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Italic.ttf',
//         bolditalics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-MediumItalic.ttf'
//     }
// };
// pdfroute.post('/generate-pdf', async (req, res) => {
//     const { room_id } = req.body;

//     try {
//         const { roomDetails, managerName } = await createPdfDefinition(room_id);
//         if (!roomDetails) {
//             return res.status(404).send('Room details not found.');
//         }

//         const pdfDoc = generateDocDefinition(roomDetails, managerName, fonts);
//         const pdfChunks = [];

//         pdfDoc.on('data', (chunk) => pdfChunks.push(chunk));

//         pdfDoc.on('end', () => {
//             const result = Buffer.concat(pdfChunks);
//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', `attachment; filename=payment_slip_${room_id}.pdf`);
//             res.send(result);
//         });

//         pdfDoc.end();
//     } catch (error) {
//         console.error('Error in PDF generation:', error);
//         res.status(500).send(error.message);
//     }
// });

// export default pdfroute;


import express from 'express';
import PdfPrinter from 'pdfmake';
import { createPdfDefinition, fonts } from '../controllers/paymentpdfcontroller';

const pdfroute = express.Router();

const generatePdfForMultipleRooms = async (req, res) => {
    const { room_ids } = req.body;

    const printer = new PdfPrinter(fonts);
    let docDefinitions = [];

    for (const room_id of room_ids) {
        const docDefinition = await createPdfDefinition(room_id);
        if (docDefinition) {
            docDefinitions.push(docDefinition.content);
        }
    }

    const finalDocDefinition = {
        content: docDefinitions.flat(),
        styles: docDefinitions[0]?.styles,
        defaultStyle: {
            font: 'Roboto'
        }
    };

    const pdfDoc = printer.createPdfKitDocument(finalDocDefinition);
    const pdfChunks = [];

    pdfDoc.on('data', chunk => pdfChunks.push(chunk));
    pdfDoc.on('end', () => {
        const result = Buffer.concat(pdfChunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="payment_details.pdf"');
        res.send(result);
    });

    pdfDoc.end();
};

pdfroute.post('/generate-pdf-multiple', generatePdfForMultipleRooms);

export default pdfroute;
