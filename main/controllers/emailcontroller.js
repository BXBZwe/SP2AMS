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

        const activeTenant = roomDetails.tenants[0];
        if (!activeTenant) {
            return res.status(404).send('Active tenant not found.');
        }

        const { total_amount, billing_date } = roomDetails.bills[0];
        const managerDetails = await prisma.manager.findFirst();


        const formattedBillingDate = billing_date.toLocaleDateString('en-US', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const billDetails = roomDetails.bills[0];
        const roombaserent = roomDetails.base_rent;
        const billItemsHTML = roomDetails.room_rates.map(rate => {
            let quantity, costPerUnit;

            if (rate.rates.item_name === 'Water') {
                quantity = billDetails.water_usage;
                costPerUnit = rate.rates.item_price;
            } else if (rate.rates.item_name === 'Electricity') {
                quantity = billDetails.electricity_usage;
                costPerUnit = rate.rates.item_price;
            } else {
                quantity = rate.quantity;
                costPerUnit = rate.rates.item_price;
            }

            const totalCost = (costPerUnit * quantity).toFixed(2);

            return `
              <tr>
                <td>${rate.rates.item_name} (${formattedBillingDate})</td>
                <td style="text-align: right;">฿${costPerUnit.toFixed(2)}</td>
                <td style="text-align: right;">${quantity.toFixed(2)}</td>
                <td style="text-align: right;">฿${totalCost}</td>
              </tr>
            `;
        }).join('');

        const DueDate = new Date(billing_date.setDate(billing_date.getDate() + 14));

        const formattedduedate = DueDate.toLocaleDateString('en-US', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const baseRentRowHTML = `
<tr>
  <td>Room Base Rent</td>
  <td style="text-align: right;">-</td>
  <td style="text-align: right;">1</td>
  <td style="text-align: right;">฿${roombaserent.toFixed(2)}</td>
</tr>
`;
        const emailContent = `
<html>
<head>
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <p>P.S. Part General Partnership<br>
  7 Thanomchit Road, Sutthisan Road, Din Daeng District, Bangkok 10400  billing Number R${billDetails.billing_number}<br>

  <p>Bill To:<br>
  ${activeTenant.first_name} ${activeTenant.last_name} (Room ${roomDetails.room_number})<br>
  ${activeTenant.addresses.addressnumber} ${activeTenant.addresses.street}<br>
  ${activeTenant.addresses.sub_district}, ${activeTenant.addresses.district}<br>
  ${activeTenant.addresses.province} ${activeTenant.addresses.postal_code}</p>

  <p>Statement Date: ${formattedBillingDate}<br>
  Due Date: ${formattedduedate}</p>

  <table>
    <tr>
      <th>Description</th>
      <th>Price Per Unit</th>
      <th>Quantity</th>
      <th>Amount</th>
    </tr>
    ${billItemsHTML}
    ${baseRentRowHTML}
  </table>

  <p>Total Due: <strong>฿${total_amount.toFixed(2)}</strong></p>
  
  <p>*Please make your payment by the due date.</p>
  
  <p>Thank you for your prompt payment.</p>
  
  <p>Sincerely,<br>
  ${managerDetails.name}<br>
  Manager</p>
</body>
</html>`;

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
            html: emailContent,
        });

        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error in Emailsender:', error);
        res.status(500).json({ error: error.message });
    }
};

export { Emailsender };
