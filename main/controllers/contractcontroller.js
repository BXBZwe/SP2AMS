import { PrismaClient } from '@prisma/client';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import libre from 'libreoffice-convert';

const prisma = new PrismaClient();

const getTemplateFilePath = (language) => {
    const basePath = 'C:\\\\Senior_Project2';
    let filePath;
    try {
        if (language.toLowerCase() === 'english') {
            filePath = `${basePath}\\\\english\\\\english.docx`;
        } else if (language.toLowerCase() === 'thai') {
            filePath = `${basePath}\\\\thai\\\\thai.docx`;
        }
        console.log(`Attempting to open file at path: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error(`Error while constructing file path: ${error.message}`);
        throw new Error(error.message);
    }
}

const convertDocxToPdf = async (docxPath, pdfPath) => {
    const docx = fs.readFileSync(docxPath);
    return new Promise((resolve, reject) => {
        libre.convert(docx, '.pdf', undefined, (err, done) => {
            if (err) {
                reject(err);
            } else {
                fs.writeFileSync(pdfPath, done);
                resolve(pdfPath);
            }
        });
    });
};

const fetchContractDetail = async (req, res) => {
    try {
        const contractDetails = await prisma.tenancy_records.findMany({
            select: {
                move_in_date: true,
                move_out_date: true,
                tenancy_status: true,
                RoomBaseDetails: {
                    select: {
                        room_number: true,
                    },
                },
                tenants: {
                    select: {
                        tenant_id: true,
                        first_name: true,
                        last_name: true,
                        contract_status: true,
                    },
                },
            }
        });

        const currentDate = new Date();
        const detailedContracts = contractDetails.map((detail) => {
            const moveOutDate = detail.move_out_date ? new Date(detail.move_out_date) : null;
            const contractDaysLeft = moveOutDate ? Math.ceil((moveOutDate - currentDate) / (1000 * 60 * 60 * 24)) : null;

            return {
                ...detail,
                tenants: detail.tenants,
                RoomBaseDetails: detail.RoomBaseDetails,
                contract_days_left: contractDaysLeft,
            };
        });

        res.json(detailedContracts);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const fetchTenantData = async (tenantId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    try {
        const tenantData = await prisma.tenants.findUnique({
            where: {
                tenant_id: tenantId,
            },
            include: {
                addresses: {
                    select: {
                        street: true,
                        sub_district: true,
                        district: true,
                        province: true,
                    },
                },
                RoomBaseDetails: {
                    select: {
                        room_number: true,
                        floor: true,
                    },
                },
                tenancy_records: {
                    where: {
                        tenancy_status: 'CHECK_IN', // Filter for records with CHECK_IN status
                    },
                    select: {
                        period_of_stay: true,
                        move_in_date: true,
                        move_out_date: true,
                    },
                },
            },
        });

        tenantData.currentMonth = currentMonth;
        tenantData.currentYear = currentYear;
        console.log("contract tenantdata:", tenantData);

        return tenantData;
    } catch (error) {
        console.error('Error fetching tenant data:', error);
        throw error;
    }
};

const fillDocxTemplate = async (filePath, data, language) => {
    const content = fs.readFileSync(path.resolve(filePath), 'binary');
    const tenantName = `${data.first_name}_${data.last_name}`;
    console.log("The data for inside contract:", data);
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.setData({
        First_name: data.first_name,
        Last_name: data.last_name,
        Personal_ID: data.personal_id,
        Street: data.addresses.street,
        Subdistrict: data.addresses.sub_district,
        District: data.addresses.district,
        Province: data.addresses.province,
        Room_number: data.RoomBaseDetails.room_number,
        Floor: data.RoomBaseDetails.floor,
        Period_of_stay: data.tenancy_records[0].period_of_stay,
        Move_in_date: formatDate(data.tenancy_records[0].move_in_date),
        Move_out_date: formatDate(data.tenancy_records[0].move_out_date),
        Month: data.currentMonth,
        Year: data.currentYear
    });

    try {
        doc.render();
    } catch (error) {
        const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };
        console.log(JSON.stringify({ error: e }));
        throw error;
    }

    const outputDir = path.join(__dirname, language, tenantName);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const docxPath = path.join(outputDir, `${tenantName}_contract.docx`);
    const pdfPath = path.join(outputDir, `${tenantName}_contract.pdf`);
    const buf = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    fs.writeFileSync(docxPath, buf);
    try {
        const pdfFilePath = await convertDocxToPdf(docxPath, pdfPath);
        return pdfFilePath;
    } catch (error) {
        console.error('Error converting DOCX to PDF:', error);
        throw error;
    }
};

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
};


export { getTemplateFilePath, fetchTenantData, fillDocxTemplate, fetchContractDetail };
