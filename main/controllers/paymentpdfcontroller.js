// import { PrismaClient } from '@prisma/client';
// import PdfPrinter from 'pdfmake';

// const prisma = new PrismaClient();

// const createPdfDefinition = async (room_id) => {
//     console.log("Room ID for pdf:", room_id);

//     const roomDetails = await prisma.roomBaseDetails.findUnique({
//         where: {
//             room_id: parseInt(room_id),
//         },
//         include: {
//             tenants: {
//                 where: { account_status: 'ACTIVE' },
//                 include: {
//                     addresses: true,
//                     contacts: true,
//                 },
//             },
//             bills: {
//                 orderBy: { billing_date: 'desc' },
//                 take: 1,
//             },
//             room_rates: {
//                 include: {
//                     rates: true,
//                 },
//             },
//         },
//     });

//     console.log('Room details fetched:', roomDetails);

//     if (!roomDetails) {
//         console.error('Roomdetails not found for room ID:', room_id);
//         return {};
//     }

//     const manager = await prisma.manager.findFirst();
//     return {
//         roomDetails,
//         managerName: manager ? manager.name : 'Manager Name Not Found'
//     };

// }

// const generateDocDefinition = (roomDetails, managerName, fonts) => {
//     const printer = new PdfPrinter(fonts);
//     const { first_name, last_name, addresses } = roomDetails.tenants[0];
//     const { room_number, base_rent, room_rates, bills } = roomDetails;
//     const latestBill = bills[0];
//     const currentDateTime = new Date().toLocaleString();

//     const billingDateFormatted = `${latestBill.billing_date.getDate()} ${latestBill.billing_date.toLocaleString('default', { month: 'short' })}. ${latestBill.billing_date.getFullYear()}`;

//     const billItems = room_rates.map(rateDetail => [
//         rateDetail.rates.item_name,
//         `฿${rateDetail.rates.item_price.toFixed(2)}`,
//         rateDetail.quantity.toString(),
//         `฿${(rateDetail.quantity * rateDetail.rates.item_price).toFixed(2)}`
//     ]);

//     billItems.unshift([
//         'Room Base Rent',
//         `฿${base_rent.toFixed(2)}`,
//         '1',
//         `฿${base_rent.toFixed(2)}`
//     ]);

//     const docDefinition = {
//         content: [
//             { text: 'P.S. Part General Partnership', style: 'header' },
//             { text: '7 Soi Thanomchit, Suthisan Road, Din Daeng Subdistrict, Din Daeng District, Bangkok 10400 Tax ID 099 2 00360768 6', style: 'subheader' },
//             { text: `Date: ${currentDateTime}`, alignment: 'right' },
//             { text: `Name: Miss ${first_name} ${last_name} (Room ${room_number})`, style: 'subheader' },
//             { text: `Address: ${addresses.addressnumber} ${addresses.street} ${addresses.sub_district} ${addresses.district} ${addresses.province} ${addresses.postal_code}` },
//             {
//                 style: 'tableExample',
//                 table: {
//                     widths: ['*', 'auto', 'auto', 'auto'],
//                     body: [
//                         [{ text: 'List', style: 'tableHeader' }, { text: 'Per Unit', style: 'tableHeader' }, { text: 'Quantity', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }],
//                         ...billItems,
//                         [{ text: 'Total amount', colSpan: 3 }, {}, {}, `฿${latestBill.total_amount.toFixed(2)}`]
//                     ]
//                 }
//             },
//             { text: `*Please pay within: ${billingDateFormatted}`, style: 'footer' },
//             { text: `Manager: ${managerName}`, style: 'footer' },
//         ],
//         styles: {
//             header: {
//                 fontSize: 18,
//                 bold: true,
//                 margin: [0, 0, 0, 10]
//             },
//             subheader: {
//                 fontSize: 14,
//                 bold: false,
//                 margin: [0, 10, 0, 5]
//             },
//             tableExample: {
//                 margin: [0, 5, 0, 15]
//             },
//             tableHeader: {
//                 bold: true,
//                 fontSize: 13,
//                 fillColor: '#eeeeee',
//             },
//             footer: {
//                 fontSize: 12,
//                 italics: true,
//                 margin: [0, 10, 0, 10]
//             }
//         },
//         defaultStyle: {
//             font: 'Roboto'
//         }
//     };

//     return printer.createPdfKitDocument(docDefinition);
// };

// export { createPdfDefinition, generateDocDefinition };


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fonts = {
    Roboto: {
        normal: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Regular.ttf',
        bold: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Medium.ttf',
        italics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-Italic.ttf',
        bolditalics: 'C:\\Senior_Project2\\PS_Park_fonts\\Roboto-MediumItalic.ttf'
    }
};

// Payment Bill Reciept Generation
const createPdfDefinition = async (room_id) => {
    const roomDetails = await prisma.roomBaseDetails.findUnique({
        where: {
            room_id: parseInt(room_id),
        },
        include: {
            tenants: {
                where: { account_status: 'ACTIVE' },
                include: {
                    addresses: true,
                    contacts: true,
                },
            },
            bills: {
                orderBy: { billing_date: 'desc' },
                take: 1,
            },
            room_rates: {
                include: {
                    rates: true,
                },
            },
        },
    });

    if (!roomDetails) {
        console.error('Room details not found for room ID:', room_id);
        return null;
    }

    const manager = await prisma.manager.findFirst();
    const managerName = manager ? manager.name : 'Manager Name Not Found';

    return generateDocDefinition(roomDetails, managerName);
};

const generateDocDefinition = (roomDetails, managerName) => {
    const { tenants, room_number, base_rent, room_rates, bills } = roomDetails;
    const tenant = tenants[0];
    const latestBill = bills[0];

    const billingDateFormatted = `${latestBill.billing_date.getDate()} ${latestBill.billing_date.toLocaleString('default', { month: 'short' })}. ${latestBill.billing_date.getFullYear()}`;

    const billItems = room_rates.map(rateDetail => [
        rateDetail.rates.item_name,
        `฿${rateDetail.rates.item_price.toFixed(2)}`,
        rateDetail.quantity.toString(),
        `฿${(rateDetail.quantity * rateDetail.rates.item_price).toFixed(2)}`
    ]);

    billItems.unshift([
        'Room Base Rent',
        `฿${base_rent.toFixed(2)}`,
        '1',
        `฿${base_rent.toFixed(2)}`
    ]);

    const docDefinition = {
        content: [
            { text: 'P.S. Part General Partnership', style: 'header' },
            { text: 'Room Payment Details', style: 'subheader' },
            { text: `Date: ${new Date().toLocaleDateString()}`, alignment: 'right' },
            { text: `Tenant: ${tenant.first_name} ${tenant.last_name}`, style: 'subheader' },
            { text: `Room Number: ${room_number}`, style: 'subheader' },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'Item', style: 'tableHeader' }, { text: 'Per Unit', style: 'tableHeader' }, { text: 'Quantity', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }],
                        ...billItems,
                        [{ text: 'Total Amount', colSpan: 3 }, {}, {}, `฿${latestBill.total_amount.toFixed(2)}`]
                    ]
                }
            },
            { text: `*Please pay by: ${billingDateFormatted}`, style: 'footer' },
            { text: `Manager: ${managerName}`, style: 'footer' },
            { text: '', pageBreak: 'after' }

        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: false,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                fillColor: '#eeeeee',
            },
            footer: {
                fontSize: 12,
                italics: true,
                margin: [0, 10, 0, 10]
            }
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };

    return docDefinition;
};


// Payment Bill Reciept Generation
const createInvoicePdfDefinition = async (room_id) => {
    const roomDetails = await prisma.roomBaseDetails.findUnique({
        where: {
            room_id: parseInt(room_id),
        },
        include: {
            tenants: {
                where: { account_status: 'ACTIVE' },
                include: {
                    addresses: true,
                    contacts: true,
                },
            },
            bills: {
                orderBy: { billing_date: 'desc' },
                take: 1,
            },
            room_rates: {
                include: {
                    rates: true,
                },
            },
        },
    });

    if (!roomDetails) {
        console.error('Room details not found for room ID:', room_id);
        return null;
    }

    const manager = await prisma.manager.findFirst();
    const managerName = manager ? manager.name : 'Manager Name Not Found';

    return generateInvoiceDocDefinition(roomDetails, managerName);
};

const generateInvoiceDocDefinition = (roomDetails, managerName) => {
    const { tenants, room_number, base_rent, room_rates, bills } = roomDetails;
    const tenant = tenants[0];
    const latestBill = bills[0];

    const billingDateFormatted = `${latestBill.billing_date.getDate()} ${latestBill.billing_date.toLocaleString('default', { month: 'short' })}. ${latestBill.billing_date.getFullYear()}`;

    const billItems = room_rates.map(rateDetail => [
        rateDetail.rates.item_name,
        `฿${rateDetail.rates.item_price.toFixed(2)}`,
        rateDetail.quantity.toString(),
        `฿${(rateDetail.quantity * rateDetail.rates.item_price).toFixed(2)}`
    ]);

    billItems.unshift([
        'Room Base Rent',
        `฿${base_rent.toFixed(2)}`,
        '1',
        `฿${base_rent.toFixed(2)}`
    ]);

    const docDefinition = {
        content: [
            { text: 'P.S. Part General Partnership', style: 'header' },
            { text: 'Invoice Details', style: 'subheader' },
            { text: `Date: ${new Date().toLocaleDateString()}`, alignment: 'right' },
            { text: `Tenant: ${tenant.first_name} ${tenant.last_name}`, style: 'subheader' },
            { text: `Room Number: ${room_number}`, style: 'subheader' },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'Item', style: 'tableHeader' }, { text: 'Per Unit', style: 'tableHeader' }, { text: 'Quantity', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }],
                        ...billItems,
                        [{ text: 'Total Amount', colSpan: 3 }, {}, {}, `฿${latestBill.total_amount.toFixed(2)}`]
                    ]
                }
            },
            { text: `*Please pay by: ${billingDateFormatted}`, style: 'footer' },
            { text: `Manager: ${managerName}`, style: 'footer' },
            { text: '', pageBreak: 'after' }

        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: false,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                fillColor: '#eeeeee',
            },
            footer: {
                fontSize: 12,
                italics: true,
                margin: [0, 10, 0, 10]
            }
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };

    return docDefinition;
};
export { createPdfDefinition,createInvoicePdfDefinition, fonts };
