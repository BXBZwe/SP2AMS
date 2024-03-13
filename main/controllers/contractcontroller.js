const { app } = require('electron');
import { PrismaClient } from '@prisma/client';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import libre from 'libreoffice-convert';


const prisma = new PrismaClient();

const logFilePath = path.join(app.getPath('userData'), 'app.log');

function logMessage(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`);
}

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

const checkDirectories = () => {
    const directoriesToCheck = [
        'C:\\Senior_Project2\\english',
        'C:\\Senior_Project2\\thai'
    ];

    directoriesToCheck.forEach((dirPath) => {
        if (!fs.existsSync(dirPath)) {
            console.error(`Directory does not exist: ${dirPath}`);
        } else {
            console.log(`Directory exists: ${dirPath}`);
        }
    });
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
    let basePath;

    if (process.env.NODE_ENV === 'production') {
        logMessage(`Resources path: ${process.resourcesPath}`);
        basePath = path.join(process.resourcesPath, 'resources');
        logMessage(`Production base path: ${basePath}`);

    } else {
        checkDirectories();
        basePath = 'C:\\Senior_Project2';
    }

    let filePath;
    try {
        if (language.toLowerCase() === 'english') {
            filePath = path.join(basePath, 'english', 'english.docx');
        } else if (language.toLowerCase() === 'thai') {
            filePath = path.join(basePath, 'thai', 'thai.docx');
        }
        console.log(`Attempting to open file at path: ${filePath}`);
        logMessage(`Attempting to open file at path: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            logMessage(`File not found at path: ${filePath}`);
            throw new Error(`File not found at path: ${filePath}`);
        }
        return filePath;
    } catch (error) {
        console.error(`Error while constructing file path: ${error.message}`);
        logMessage(`Error while constructing file path: ${error.message}`);
        throw new Error(error.message);
    }
};


const convertDocxToPdf = (docxBuffer) => {
    return new Promise((resolve, reject) => {
        libre.convert(docxBuffer, '.pdf', undefined, (err, done) => {
            if (err) {
                logMessage(`Error during DOCX to PDF conversion: ${err}`);
                reject(err);
            } else {
                logMessage(`DOCX to PDF conversion successful.`);
                resolve(done);
            }
        });
    });
};


const fetchContractDetail = async (req, res) => {
    try {
        logMessage("fetchContractDetail: Fetching contract details.");
        // const contractDetails = await prisma.tenancy_records.findMany({
        //     select: {
        //         move_in_date: true,
        //         move_out_date: true,
        //         tenancy_status: true,
        //         RoomBaseDetails: {
        //             select: {
        //                 room_number: true,
        //             },
        //         },
        //         tenants: {
        //             select: {
        //                 tenant_id: true,
        //                 first_name: true,
        //                 last_name: true,
        //                 contract_status: true,
        //             },
        //         },
        //     }
        // });

        const contractDetails = await prisma.tenancy_records.findMany({
            where: {
                tenancy_status: {
                    not: 'CHECK_OUT', // Exclude tenancy records with CHECK_OUT status
                },
            },
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
        logMessage(`fetchContractDetail: Error - ${error.message}`);
        res.status(500).send(error.message);
    }
};


const fetchTenantData = async (tenantId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    try {
        logMessage(`fetchTenantData: Fetching tenant data for ID ${tenantId}`);
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
        logMessage(`fetchTenantData: Error - ${error.message}`);
        console.error('Error fetching tenant data:', error);
        throw error;
    }
};


const fillDocxTemplate = async (filePath, data, language) => {
    logMessage(`fillDocxTemplate: Starting to fill DOCX template for language: ${language}.`);

    try {
        await updateTenantContractStatus(data.tenant_id);
        logMessage('fillDocxTemplate: Tenant contract status updated.');

        const content = fs.readFileSync(path.resolve(filePath), 'binary');
        const tenantName = `${data.first_name}_${data.last_name}`;
        logMessage(`fillDocxTemplate: Read file content for tenant: ${tenantName}.`);

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

        doc.render();
        logMessage('fillDocxTemplate: DOCX template rendered successfully.');

        // const outputDir = path.join(__dirname, language, tenantName);
        // logMessage(`fillDocxTemplate: Expected output directory is ${outputDir}`);
        // if (!fs.existsSync(outputDir)) {
        //     logMessage('fillDocxTemplate: Output directory does not exist. Attempting to create it.');
        //     fs.mkdirSync(outputDir, { recursive: true });
        //     logMessage('fillDocxTemplate: Output directory created.');
        // }
        // logMessage(`fillDocxTemplate: Output directory verified/created at ${outputDir}.`);

        // const docxPath = path.join(outputDir, `${tenantName}_contract.docx`);
        // const pdfPath = path.join(outputDir, `${tenantName}_contract.pdf`);
        const buf = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
        // fs.writeFileSync(docxPath, buf);
        // logMessage(`fillDocxTemplate: DOCX template filled and written to path: ${docxPath}.`);

        try {
            const pdfBuffer = await convertDocxToPdf(buf);
            logMessage(`fillDocxTemplate: PDF conversion successful.`);
            return pdfBuffer;
        } catch (error) {
            logMessage(`fillDocxTemplate: Error converting DOCX to PDF: ${error.message}`);
            throw error;
        }
    } catch (error) {
        logMessage(`fillDocxTemplate: Error during template processing: ${error.message}`);
        throw error;
    }
};

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
};


const fetchSpecificContractDetail = async (req, res) => {
    const contractId = parseInt(req.params.contractId);

    try {
        const contractDetail = await prisma.tenancy_records.findUnique({
            where: {
                tenant_id: contractId,
            },
            select: {
                move_in_date: true,
                move_out_date: true,
                tenancy_status: true,
                period_of_stay: true,
                RoomBaseDetails: {
                    select: {
                        room_number: true,
                        floor: true,
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
            },
        });

        if (!contractDetail) {
            res.status(404).send(`Contract with ID ${contractId} not found.`);
            return;
        }

        const currentDate = new Date();
        const moveOutDate = new Date(contractDetail.move_out_date);
        const contractDaysLeft = Math.ceil((moveOutDate - currentDate) / (1000 * 60 * 60 * 24));

        let newStatus;
        if (contractDaysLeft <= 0) newStatus = 'DUE';
        else if (contractDaysLeft < 30) newStatus = 'WARNING';
        else newStatus = 'ONGOING';

        res.json({
            ...contractDetail,
            contract_days_left: contractDaysLeft,
            contract_status: newStatus,
        });
    } catch (error) {
        console.error(`Error fetching specific contract detail:`, error);
        res.status(500).send(error.message);
    }
};




export { getTemplateFilePath, fetchTenantData, fillDocxTemplate, fetchContractDetail, updateTenantContractStatus, updatePeriodOfStay, fetchSpecificContractDetail };
