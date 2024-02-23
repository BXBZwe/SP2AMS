import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

//get all tenants
const getAlltenants = async (req, res) => {
    try {
        const getTenant = await prisma.tenants.findMany({
            include: {
                addresses: true,
                contacts: true,
                RoomBaseDetails: true,
            },
        });
        //console.log("getAlltenants: Tenants fetched", getTenant);
        res.status(200).json({ message: 'Get all tenants successfully', getTenant });
    } catch (error) {
        console.error("getAlltenants: Error", error);
        res.status(500).send(error.message);
    }
};

//get a tenant
const geteachtenant = async (req, res) => {
    const { tenant_id } = req.params;
    console.log("Received tenant_id:", tenant_id);

    try {
        const getaTenant = await prisma.tenants.findUnique({
            where: { tenant_id: parseInt(tenant_id) },
            include: {
                addresses: true,
                contacts: true,
            }
        });
        console.log("Fetched tenant data:", getaTenant);

        if (getaTenant) {
            const baseUrl = 'http://localhost:3000/images/';

            getaTenant.tenant_image = getaTenant.tenant_image ? `${baseUrl}${path.basename(getaTenant.tenant_image)}` : null;
            getaTenant.nationalcard_image = getaTenant.nationalcard_image ? `${baseUrl}${path.basename(getaTenant.nationalcard_image)}` : null;
            console.log("Tenant image url :", path.basename(getaTenant.tenant_image));
            console.log("national image url :", path.basename(getaTenant.nationalcard_image));

            res.status(200).json({ message: 'Get a tenant successfully', getaTenant });
        } else {
            res.status(404).json({ message: 'Tenant not found' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//add new tenant
const addnewtenant = async (req, res) => {
    console.log("Request body:", req.body);

    const tenant_image = req.files['tenant_image'] ? req.files['tenant_image'][0].path : null;
    const nationalcard_image = req.files['nationalcard_image'] ? req.files['nationalcard_image'][0].path : null;

    try {
        const addressesObject = JSON.parse(req.body.addresses);
        const contactsObject = JSON.parse(req.body.contacts);

        const newTenant = await prisma.tenants.create({
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                personal_id: req.body.personal_id,
                contract_status: 'NEW',
                account_status: 'ACTIVE',
                invoice_option: req.body.invoice_option,
                tenant_image: tenant_image,
                nationalcard_image: nationalcard_image,
                addresses: {
                    create: addressesObject,
                },
                contacts: {
                    create: contactsObject,
                }
            },
            include: {
                addresses: true,
                contacts: true,
            },
        });
        res.status(200).json({ message: 'Added a new Tenant successfully', newTenant });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

//delete tenant
const deletetenant = async (req, res) => {
    const { tenant_id } = req.params;
    try {
        const tenant = await prisma.tenants.findUnique({
            where: { tenant_id: parseInt(tenant_id) },
            select: {
                tenant_image: true,
                nationalcard_image: true,
            }
        });

        if (tenant) {
            [tenant.tenant_image, tenant.nationalcard_image].forEach((imagePath) => {
                if (imagePath && fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        await prisma.tenants.delete({
            where: { tenant_id: parseInt(tenant_id) },
            include: {
                addresses: true,
                contacts: true,
            }
        });

        res.status(200).json({ message: 'Tenant Deleted successfully' });
    } catch (error) {
        res.status(200).send(error.message);
    }
};

//update tenant
const updatetenant = async (req, res) => {

    const { tenant_id } = req.params;
    // console.log("Update address", req.body.addresses);
    // console.log("Address street:", req.body.addresses.street);
    // console.log("Address Number:", req.body.addresses.addressnumber); 

    // console.log("Update contact", req.body.contacts);

    try {

        const currentTenant = await prisma.tenants.findUnique({
            where: { tenant_id: parseInt(tenant_id) },
            select: {
                tenant_image: true,
                nationalcard_image: true,
            }
        });

        const newTenantImagePath = req.files['tenant_image'] ? req.files['tenant_image'][0].path : currentTenant.tenant_image;
        const newNationalCardImagePath = req.files['nationalcard_image'] ? req.files['nationalcard_image'][0].path : currentTenant.nationalcard_image;

        const updatedTenant = await prisma.tenants.update({
            where: { tenant_id: parseInt(tenant_id) },
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                personal_id: req.body.personal_id,
                invoice_option: req.body.invoice_option,
                account_status: req.body.account_status,
                tenant_image: newTenantImagePath,
                nationalcard_image: newNationalCardImagePath,
                addresses: {
                    upsert: {
                        where: { tenant_id: parseInt(tenant_id) },
                        update: {
                            addressnumber: req.body.addresses.addressnumber,
                            street: req.body.addresses.street,
                            sub_district: req.body.addresses.sub_district,
                            district: req.body.addresses.district,
                            province: req.body.addresses.province,
                            postal_code: req.body.addresses.postal_code
                        },
                        create: {
                            //tenant_id: parseInt(tenant_id)
                            addressnumber: req.body.addresses.addressnumber,
                            street: req.body.addresses.street,
                            sub_district: req.body.addresses.sub_district,
                            district: req.body.addresses.district,
                            province: req.body.addresses.province,
                            postal_code: req.body.addresses.postal_code
                        }
                    }
                },
                contacts: {
                    upsert: {
                        where: { tenant_id: parseInt(tenant_id) },
                        update: {
                            phone_number: req.body.contacts.phone_number,
                            email: req.body.contacts.email,
                            line_id: req.body.contacts.line_id,
                            eme_name: req.body.contacts.eme_name,
                            eme_phone: req.body.contacts.eme_phone,
                            eme_line_id: req.body.contacts.eme_line_id,
                            eme_relation: req.body.contacts.eme_relation
                        },
                        create: {
                            //tenant_id: parseInt(tenant_id), 
                            phone_number: req.body.contacts.phone_number,
                            email: req.body.contacts.email,
                            line_id: req.body.contacts.line_id,
                            eme_name: req.body.contacts.eme_name,
                            eme_phone: req.body.contacts.eme_phone,
                            eme_line_id: req.body.contacts.eme_line_id,
                            eme_relation: req.body.contacts.eme_relation
                        }
                    }
                },
            },
            include: {
                addresses: true,
                contacts: true,
            },
        });

        if (currentTenant.tenant_image !== newTenantImagePath && fs.existsSync(currentTenant.tenant_image)) {
            fs.unlinkSync(currentTenant.tenant_image);
        }
        if (currentTenant.nationalcard_image !== newNationalCardImagePath && fs.existsSync(currentTenant.nationalcard_image)) {
            fs.unlinkSync(currentTenant.nationalcard_image);
        }
        res.status(200).json({ message: 'Tenant updated successfully', data: updatedTenant });
    } catch (error) {
        console.error('Error updating tenant:', error);
        res.status(500).send(error.message);
    }
};



export { getAlltenants, geteachtenant, addnewtenant, deletetenant, updatetenant };