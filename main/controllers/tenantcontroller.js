import { PrismaClient } from '@prisma/client';
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
    console.log("Received tenant_id:", tenant_id); // Log the tenant_id to console

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
    console.log("Request body:", req.body); // Add this line to log the request body

    try {
        const newTenant = await prisma.tenants.create({
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                personal_id: req.body.personal_id,
                contract_status: 'NEW',
                account_status: 'ACTIVE',
                invoice_option: req.body.invoice_option,
                addresses: {
                    create: req.body.addresses,
                },
                contacts: {
                    create: req.body.contacts,
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
    try {
        const updatedTenant = await prisma.tenants.update({
            where: { tenant_id: parseInt(tenant_id) },
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                personal_id: req.body.personal_id,
                invoice_option: req.body.invoice_option,
                addresses: {
                    upsert: {
                        where: { tenant_id: parseInt(tenant_id) },
                        update: {
                            street: req.body.addresses.street,
                            sub_district: req.body.addresses.sub_district,
                            district: req.body.addresses.district,
                            province: req.body.addresses.province,
                            postal_code: req.body.addresses.postal_code
                        },
                        create: {
                            //tenant_id: parseInt(tenant_id)
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
        res.status(200).json({ message: 'Tenant updated successfully', data: updatedTenant });
    } catch (error) {
        console.error('Error updating tenant:', error);
        res.status(500).send(error.message);
    }
};



export { getAlltenants, geteachtenant, addnewtenant, deletetenant, updatetenant };