import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
require('dotenv').config();

const prisma = new PrismaClient();

const Emailsender = async (req, res) => {
    //console.log("Emailsender function called");
    //console.log("Request body:", req.body);

    const { to, subject, message, room_id } = req.body; // Destructure 'to' and 'subject' from req.body

    try {
        //console.log("Fetching bill details for room ID:", room_id);
        const bills = await prisma.bills.findFirst({
            where: {
                room_id: parseInt(room_id), 
            },
            include: {
                rooms: true, 
            },
            orderBy: {
                bill_date: 'desc',
            },
        });

        if (!bills) {
            console.log("No bill details found for room ID:", room_id);
            return res.status(404).json({ message: 'No bill details found for the specified room ID.' });
        }

        // Format the email content with bill details and the additional message
        const emailContent = `${message}\n\nBill Details for Room Number: ${bills.rooms.room_number}
        \nWater Usage: ${bills.water_usage}
        \nElectricity Usage: ${bills.electricity_usage}
        \nWater Cost: ${bills.water_cost}
        \nElectricity Cost: ${bills.electricity_cost}
        \nAdditional Rates Cost: ${bills.additional_rates_cost}
        \nTotal Bill Amount: ${bills.total_amount}`;
        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.emailaccount, // Make sure these credentials are secured
                pass: process.env.emailpassword
            }
        });

        console.log("Sending email to:", to);
        // Send email
        await transporter.sendMail({
            from: process.env.emailaccount,
            to: to,
            subject: subject,
            text: emailContent,
        });

        console.log("Email sent successfully to:", to);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (e) {
        console.error("Error in Emailsender:", e);
        res.status(500).json({ error: e.message });
    }
};

export { Emailsender };
