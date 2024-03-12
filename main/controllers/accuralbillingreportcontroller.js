// import { PrismaClient } from '@prisma/client';
// import PdfPrinter from 'pdfmake';


// const prisma = new PrismaClient();

// const fonts = {
//     Roboto: {
//         normal: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Regular.ttf',
//         bold: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Medium.ttf',
//         italics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Italic.ttf',
//         bolditalics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-MediumItalic.ttf'
//     }
// };

// const fetchAccrualReport = async (year) => {
//     const startDate = new Date(`${year}-01-01`);
//     const endDate = new Date(`${year}-12-31`);

//     const rateItems = await prisma.rates.findMany({});
//     const rateItemsTemplate = rateItems.reduce((acc, rate) => {
//         acc[rate.item_name] = 0;
//         return acc;
//     }, {});

//     const billingRecords = await prisma.bills.findMany({
//         where: {
//             billing_date: {
//                 gte: startDate,
//                 lte: endDate
//             }
//         },
//         include: {
//             RoomBaseDetails: {
//                 include: {
//                     tenants: true,
//                     room_rates: {
//                         include: {
//                             rates: true
//                         }
//                     }
//                 }
//             }
//         }
//     });


//     const reportData = billingRecords.map(bill => {
//         const { RoomBaseDetails } = bill;
//         const tenantNames = RoomBaseDetails.tenants.map(tenant => `${tenant.first_name} ${tenant.last_name}`).join(', ');


//         const rateDetails = { ...rateItemsTemplate };

//         RoomBaseDetails.room_rates.forEach(roomRate => {
//             const rateCost = (roomRate.quantity * roomRate.rates.item_price).toFixed(2);
//             rateDetails[roomRate.rates.item_name] = parseFloat(rateCost) + (rateDetails[roomRate.rates.item_name] || 0);
//         });
//         rateDetails['Water'] = bill.water_cost.toFixed(2);
//         rateDetails['Electricity'] = bill.electricity_cost.toFixed(2);

//         return {
//             roomNumber: RoomBaseDetails.room_number,
//             tenantName: tenantNames,
//             rateItems: rateDetails,
//             totalBill: bill.total_amount.toFixed(2)
//         };
//     });

//     return reportData;
// };

// const printer = new PdfPrinter(fonts);

// const generateAccrualReportPDF = async (req, res) => {
//     try {
//         const year = parseInt(req.params.year);
//         const reportData = await fetchAccrualReport(year);

//         const rateItems = await prisma.rates.findMany();
//         const dynamicRateHeaders = rateItems.map(rate => rate.item_name);

//         let tableBody = [
//             ['Room Number', 'Tenant Name', ...dynamicRateHeaders, 'Total Bill']
//         ];

//         reportData.forEach((data) => {
//             let row = [
//                 data.roomNumber,
//                 data.tenantName,
//                 ...dynamicRateHeaders.map(header => data.rateItems[header]?.toString() || '0'),
//                 data.totalBill.toString()
//             ];
//             tableBody.push(row);
//         });

//         const docDefinition = {
//             content: [
//                 { text: `Accrual Report for Year: ${year}`, style: 'header' },
//                 {
//                     style: 'tableExample',
//                     table: {
//                         body: tableBody
//                     },
//                     layout: 'lightHorizontalLines'
//                 }
//             ],
//             styles: {
//                 header: {
//                     fontSize: 18,
//                     bold: true,
//                     margin: [0, 0, 0, 10]
//                 },
//                 tableExample: {
//                     margin: [0, 5, 0, 15]
//                 }
//             }
//         };

//         const pdfDoc = printer.createPdfKitDocument(docDefinition);

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename="Accrual_Report_${year}.pdf"`);

//         pdfDoc.pipe(res);
//         pdfDoc.end();

//     } catch (error) {
//         console.error("Error generating accrual report PDF", error);
//         res.status(500).send('Error generating PDF');
//     }
// };


// export { fetchAccrualReport, generateAccrualReportPDF };

import { PrismaClient } from "@prisma/client";
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

const fetchAccrualReport = async (year) => {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const rateItems = await prisma.rates.findMany({});
    const rateItemsTemplate = rateItems.reduce((acc, rate) => {
        acc[rate.item_name] = 0;
        return acc;
    }, {});

    const billingRecords = await prisma.bills.findMany({
        where: {
            billing_date: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            RoomBaseDetails: {
                include: {
                    tenants: true,
                    room_rates: {
                        include: {
                            rates: true
                        }
                    }
                }
            }
        }
    });


    const reportData = billingRecords.map(bill => {
        const { RoomBaseDetails } = bill;
        const tenantNames = RoomBaseDetails.tenants.map(tenant => `${tenant.first_name} ${tenant.last_name}`).join(', ');


        const rateDetails = { ...rateItemsTemplate };

        RoomBaseDetails.room_rates.forEach(roomRate => {
            const rateCost = (roomRate.quantity * roomRate.rates.item_price).toFixed(2);
            rateDetails[roomRate.rates.item_name] = parseFloat(rateCost) + (rateDetails[roomRate.rates.item_name] || 0);
        });
        rateDetails['Water'] = bill.water_cost.toFixed(2);
        rateDetails['Electricity'] = bill.electricity_cost.toFixed(2);

        return {
            roomNumber: RoomBaseDetails.room_number,
            tenantName: tenantNames,
            rateItems: rateDetails,
            totalBill: bill.total_amount.toFixed(2)
        };
    });

    return reportData;
};

const generatePeriodicReportExcel = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const reportData = await fetchAccrualReport(year);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Annual Report');

        const rateItems = await prisma.rates.findMany();
        const dynamicRateHeaders = rateItems.map(rate => rate.item_name);

        worksheet.columns = [
            { header: 'Room Number', key: 'roomNumber', width: 10 },
            { header: 'Tenant Name', key: 'tenantName', width: 20 },
            ...dynamicRateHeaders.map(header => ({ header, key: header, width: 10 })),
            { header: 'Total Bill', key: 'totalBill', width: 10 }
        ];

        reportData.forEach(data => {
            worksheet.addRow({
                roomNumber: data.roomNumber,
                tenantName: data.tenantName,
                ...data.rateItems,
                totalBill: data.totalBill
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="Periodic_Report_for_${year}.xlsx"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Error generating periodic report Excel", error);
        res.status(500).send('Error generating Excel file');
    }
};

export { fetchAccrualReport, generatePeriodicReportExcel };