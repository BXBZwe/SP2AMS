import { PrismaClient } from '@prisma/client';
import PdfPrinter from 'pdfmake';

const prisma = new PrismaClient();

const getPreviousReading = async (room_id, date) => {
    const previousReading = await prisma.meter_readings.findFirst({
        where: {
            room_id: room_id,
            reading_date: {
                lt: new Date(date),
            },
        },
        orderBy: {
            reading_date: 'desc',
        },
    });
    return previousReading;
}


const createMeterReadingsPdfDefinition = (readings, generationDate, readingType) => {
    const MAX_ROWS_PER_COLUMN = 2;
    const numberOfColumns = Math.ceil(readings.length / MAX_ROWS_PER_COLUMN);

    const tableHeaders = [];
    const columnWidths = [];
    for (let i = 0; i < numberOfColumns; i++) {
        tableHeaders.push({ text: 'Room', style: 'tableHeader' });
        tableHeaders.push({ text: 'Previous Measure', style: 'tableHeader' });
        tableHeaders.push({ text: 'Current Measure', style: 'tableHeader' });
        columnWidths.push('*', '*', '*');
    }

    const body = [tableHeaders];

    for (let row = 0; row < MAX_ROWS_PER_COLUMN; row++) {
        const tableRow = [];
        for (let col = 0; col < numberOfColumns; col++) {
            const readingIndex = col * MAX_ROWS_PER_COLUMN + row;
            if (readingIndex < readings.length) {
                const reading = readings[readingIndex];
                tableRow.push(reading.RoomBaseDetails.room_number.toString());
                tableRow.push(reading.previous_reading.toString());
                tableRow.push(reading.current_reading.toString());
            } else {
                tableRow.push("");
                tableRow.push("");
                tableRow.push("");
            }
        }
        body.push(tableRow);
    }

    return {
        content: [
            { text: 'Meter Readings Report', style: 'header' },
            { text: `Reading Type: ${readingType}`, style: 'subheader' },
            { text: `Generation Date: ${generationDate}`, style: 'subheader' },
            {
                style: 'tableStyle',
                table: {
                    widths: columnWidths,
                    body: body
                },
                layout: 'lightHorizontalLines'
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 15,
                bold: false,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            floorHeader: {
                fontSize: 13,
                bold: true,
                margin: [0, 5, 0, 5]
            },
            tableHeader: {
                bold: true,
                fillColor: '#eeeeee'
            },
            tableStyle: {
                margin: [0, 20, 0, 0]
            }
        },
        defaultStyle: {
        }
    };
};



const generateMeterReport = async (readingType, generationDate) => {
    const rooms = await prisma.roomBaseDetails.findMany({
        orderBy: {
            floor: 'asc',
        },
    });

    const readings = await Promise.all(rooms.map(async (room) => {
        const previousReading = await getPreviousReading(room.room_id, generationDate);
        return {
            RoomBaseDetails: room,
            previous_reading: previousReading ? previousReading[`${readingType}_reading`] : 0,
            current_reading: '',
        };
    }));

    const pdfDefinition = createMeterReadingsPdfDefinition(readings, generationDate, readingType);

    return pdfDefinition;
};

const fonts = {
    Roboto: {
        normal: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Regular.ttf',
        bold: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Medium.ttf',
        italics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Italic.ttf',
        bolditalics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-MediumItalic.ttf'
    }
};

const getMeterReportPDF = async (req, res) => {
    const { readingType, generationDate } = req.query;

    try {
        const pdfDefinition = await generateMeterReport(readingType, generationDate);
        const printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(pdfDefinition);

        let chunks = [];
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="meter_report_${generationDate}.pdf"`);
            res.send(result);
        });

        pdfDoc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating meter report PDF');
    }
};

export { getMeterReportPDF };
