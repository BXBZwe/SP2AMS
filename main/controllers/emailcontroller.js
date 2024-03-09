import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
require('dotenv').config();

const prisma = new PrismaClient();

// const Emailsender = async (req, res) => {

//     const { subject, room_id } = req.body;
//     console.log("Body for email:", req.body);
//     console.log("Room ID for email:", room_id);

//     try {
//         const roomDetails = await prisma.roomBaseDetails.findUnique({
//             where: {
//                 room_id: parseInt(room_id),
//             },
//             include: {
//                 tenants: {
//                     where: { account_status: 'ACTIVE' },
//                     include: {
//                         addresses: true,
//                         contacts: true,
//                     },
//                 },
//                 bills: {
//                     orderBy: { billing_date: 'desc' },
//                     take: 1,
//                 },
//                 room_rates: {
//                     include: {
//                         rates: true,
//                     },
//                 },
//             },
//         });
//         console.log("Room Details to send email: ", roomDetails);

//         if (!roomDetails || roomDetails.tenants.length === 0 || roomDetails.bills.length === 0) {
//             return res.status(404).send('Room details or bill not found.');
//         }

//         const activeTenant = roomDetails.tenants[0];
//         console.log("Active Tenant:", activeTenant);
//         const tenantName = `${activeTenant.first_name} ${activeTenant.last_name}`;
//         const tenantAddressNumber = activeTenant.addresses.Number;
//         const tenantAddressStreet = activeTenant.addresses.street;
//         const tenantAddressDistrict = activeTenant.addresses.district;
//         const tenantAddressSubdistrict = activeTenant.addresses.sub_district;
//         const tenantAddressprovince = activeTenant.addresses.province;
//         const tenantAddresspostal_code = activeTenant.addresses.postal_code;

//         const tenantEmail = activeTenant.contacts.email;
//         console.log("Tenant Email:", tenantEmail);

//         const roomNumber = roomDetails.room_number;
//         const { total_amount } = roomDetails.bills[0];

//         if (!tenantEmail) {
//             return res.status(404).send('Tenant email not found.');
//         }

//         let ratesList = roomDetails.room_rates.map(rate => {
//             return `${rate.rates.item_name}: ${rate.rates.item_price} x ${rate.quantity}`;
//         }).join('\n');

//         const managerDetails = await prisma.manager.findFirst();

//         const apartmentAddress = '7 Thanomchit Road, Sutthisan Road, Din Daeng District, Bangkok 10400';
//         const managerName = managerDetails.name;
//         const emailContent = `
// P.S. Part General Partnership
// ${apartmentAddress}
// Bill To:
// Name: ${tenantName} (Room ${roomNumber})
// Address: ${tenantAddressNumber} ${tenantAddressStreet} ${tenantAddressDistrict} ${tenantAddressSubdistrict}
// ${tenantAddressprovince} ${tenantAddresspostal_code}

// List
// ${ratesList}
// Total amount: ${total_amount}

// Please pay within: ${new Date().toLocaleDateString()}.

// *This is an automatically generated email, please do not reply directly to this message.

// Manager: ${managerName}
// Position: Manager`;

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_ACCOUNT,
//                 pass: process.env.EMAIL_PASSWORD,
//             },
//         });

//         await transporter.sendMail({
//             from: process.env.EMAIL_ACCOUNT,
//             to: tenantEmail,
//             subject: subject,
//             text: emailContent,
//         });

//         res.status(200).json({ message: 'Email sent successfully' });
//     } catch (error) {
//         console.error('Error in Emailsender:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

const Emailsender = async (req, res) => {
    const { subject, room_id } = req.body;
    console.log("Body for email:", req.body);
    console.log("Room ID for email:", room_id);

    try {
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
            return res.status(404).send('Room details not found.');
        }

        // Active tenant's information
        const activeTenant = roomDetails.tenants[0];
        if (!activeTenant) {
            return res.status(404).send('Active tenant not found.');
        }

        // Email content formatting
        const billItems = roomDetails.room_rates.map(rate => `${rate.rates.item_name}: ฿${rate.rates.item_price.toFixed(2)} x ${rate.quantity}`).join('\r\n');
        const { total_amount, billing_date } = roomDetails.bills[0];
        const managerDetails = await prisma.manager.findFirst();


        const formattedBillingDate = billing_date.toLocaleDateString('en-US', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const emailContent = `
P.S. Part General Partnership
7 Thanomchit Road, Sutthisan Road, Din Daeng District, Bangkok 10400
Tax ID 099 2 00360768 6

Bill To:
${activeTenant.first_name} ${activeTenant.last_name} (Room ${roomDetails.room_number})
${activeTenant.addresses.addressnumber} ${activeTenant.addresses.street}
${activeTenant.addresses.sub_district}, ${activeTenant.addresses.district}
${activeTenant.addresses.province} ${activeTenant.addresses.postal_code}

Statement Date: ${formattedBillingDate}
Due Date: ${new Date(billing_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}

Bill Details:
${billItems}

Total Due: ฿${total_amount.toFixed(2)}

*Please make your payment by the due date.

Thank you for your prompt payment.

Sincerely,
${managerDetails.name}
Manager`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_ACCOUNT,
            to: activeTenant.contacts.email,
            subject: subject,
            text: emailContent,
        });

        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error in Emailsender:', error);
        res.status(500).json({ error: error.message });
    }
};

export { Emailsender };
