import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//get all tenants
const getAlltenants = async (req, res) => {
    try {
        const getTenant = await prisma.tenants.findMany();
        res.status(200).json({ message: 'Get all tenants successfully', getTenant });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//add new tenant
const addnewtenant = async (req, res) => {
    try {
        const newTenant = await prisma.tenants.create({
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                personal_id: req.body.personal_id,
                room_id: req.body.room_id,
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
        res.status(500).send(error.message);
    }
};

//delete tenant
const deletetenant = async (req, res) => {
    const { tenant_id } = req.params;
    try {
        await prisma.tenants.delete({
            where: { tenant_id: parseInt(tenant_id) },
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
        const updatetenant = await prisma.tenants.update({
            where: { tenant_id: parseInt(tenant_id) },
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                personal_id: req.body.personal_id,
                room_id: req.body.room_id,
                addresses: {
                    //upsert: {
                        update: req.body.addresses,
                        //create: req.body.addresses,
                    //},
                },
                contacts: {
                    //upsert: {
                        update: req.body.contacts,
                        //create: req.body.contacts,
                    //},
                },
            },
            include: {
                addresses: true,
                contacts: true,
            },
        });
        res.status(200).json({ message: 'Tenant updated successfully', data: updatetenant });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
export { getAlltenants, addnewtenant, deletetenant, updatetenant };