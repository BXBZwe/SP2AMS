import { PrismaClient } from '@prisma/client';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import libre from 'libreoffice-convert';

const prisma = new PrismaClient();

const hasCheckInTenancyRecord = async (tenantId) => {
    const checkInRecords = await prisma.tenancy_records.findMany({
        where: {
            tenant_id: tenantId,
            tenancy_status: 'CHECK_IN',
        },
    });

    return checkInRecords.length > 0;
};

const updateTenantContractStatus = async (tenantId) => {
    const checkInExists = await hasCheckInTenancyRecord(tenantId);

    if (checkInExists) {
        await prisma.tenants.update({
            where: {
                tenant_id: tenantId,
            },
            data: {
                contract_status: 'ONGOING',
            },
        });
        console.log(`Contract status for tenant ID ${tenantId} updated to ONGOING.`);
    } else {
        console.log(`No CHECK_IN tenancy record found for tenant ID ${tenantId}. Contract status not updated.`);
    }
};

const updatePeriodOfStay = async (tenantId, newPeriod) => {
    try {
        const currentRecord = await prisma.tenancy_records.findFirst({
            where: {
                tenant_id: parseInt(tenantId),
                tenancy_status: 'CHECK_IN',
            },
        });

        if (!currentRecord) {
            console.log(`No CHECK_IN tenancy record found for tenant ID ${tenantId}.`);
            return;
        }

        const moveInDate = new Date(currentRecord.move_in_date);
        const newMoveOutDate = new Date(moveInDate.setMonth(moveInDate.getMonth() + parseInt(newPeriod)));

        await prisma.tenancy_records.updateMany({
            where: {
                tenant_id: parseInt(tenantId),
                tenancy_status: 'CHECK_IN',
            },
            data: {
                period_of_stay: parseInt(newPeriod),
                move_out_date: newMoveOutDate,
            },
        });

        console.log(`Period of stay and move-out date updated for tenant ID ${tenantId}`);
    } catch (error) {
        console.error('Failed to update period of stay and move-out date:', error);
        throw error;
    }
};


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
        const updatePromises = contractDetails.map(async (detail) => {
            const moveOutDate = detail.move_out_date ? new Date(detail.move_out_date) : null;
            const contractDaysLeft = moveOutDate ? Math.ceil((moveOutDate - currentDate) / (1000 * 60 * 60 * 24)) : null;

            let newStatus = detail.tenants.contract_status;

            if (contractDaysLeft <= 0) {
                newStatus = 'DUE';
            } else if (contractDaysLeft < 30) {
                newStatus = 'WARNING';
            } else if (contractDaysLeft >= 30) {
                newStatus = 'ONGOING';
            }

            if (newStatus !== detail.tenants.contract_status) {
                await prisma.tenants.update({
                    where: {
                        tenant_id: detail.tenants.tenant_id,
                    },
                    data: {
                        contract_status: newStatus,
                    },
                });
            }

            return {
                ...detail,
                tenants: detail.tenants,
                RoomBaseDetails: detail.RoomBaseDetails,
                contract_days_left: contractDaysLeft,
            };
        });

        const detailedContracts = await Promise.all(updatePromises);
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
                        tenancy_status: 'CHECK_IN',
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
    await updateTenantContractStatus(data.tenant_id);
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


export { getTemplateFilePath, fetchTenantData, fillDocxTemplate, fetchContractDetail, updateTenantContractStatus, updatePeriodOfStay };
