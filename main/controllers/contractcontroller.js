import { PrismaClient } from '@prisma/client';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const getTemplateFilePath = (language) => {
    const basePath = 'C:\\Senior_Project2';
    try {
        if (language.toLowerCase() === 'english') {
            return `${basePath}\\english\\english.docx`;
        }
        else if (language.toLowerCase() === 'thai') {
            return `${basePath}\\thai\\thai.docx`;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

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
            select: {
                first_name: true,
                last_name: true,
                personal_id: true,
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

        return tenantData;
    } catch (error) {
        console.error('Error fetching tenant data:', error);
        throw error;
    }
};

const fillDocxTemplate = async (filePath, data, language) => {
    const content = fs.readFileSync(path.resolve(filePath), 'binary');
    const tenantName = `${data.first_name}_${data.last_name}`;

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.setData({
        first_name: data.first_name,
        last_name: data.last_name,
        personal_id: data.personal_id,
        street: data.addresses.street,
        sub_district: data.addresses.sub_district,
        district: data.addresses.district,
        province: data.addresses.province,
        room_number: data.RoomBaseDetails.room_number,
        floor: data.RoomBaseDetails.floor,
        period_of_stay: data.tenancy_records.period_of_stay,
        move_in_date: formatDate(data.tenancy_records.move_in_date),
        move_out_date: formatDate(data.tenancy_records.move_out_date),
        currentMonth: data.currentMonth,
        currentYear: data.currentYear
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

    const outputPath = path.join(outputDir, `${tenantName}_contract.docx`);

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    fs.writeFileSync(outputPath, buf);
    return outputPath;
};

const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('th-TH');
};


export { getTemplateFilePath, fetchTenantData, fillDocxTemplate, fetchContractDetail };
