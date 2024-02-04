import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const checkIn = async (req, res) => {
  try {
    // Convert contract months to an actual date for move-out
    const moveOutDate = new Date(req.body.move_in_date);
    moveOutDate.setMonth(moveOutDate.getMonth() + req.body.period_of_stay);

    // Create a record in the tenancy_records table
    const tenancyRecord = await prisma.tenancy_records.create({
      data: {
        tenant_id: req.body.tenant_id,
        room_id: req.body.room_id,
        move_in_date: req.body.move_in_date,
        move_out_date: moveOutDate,
        period_of_stay: req.body.period_of_stay
      }
    });

    // Update the tenant's contract status to 'ONGOING'
    await prisma.tenants.update({
      where: { tenant_id: req.body.tenant_id },
      data: { contract_status: 'NEW' },
    });

    // Update the room's occupancy status to 'OCCUPIED'
    await prisma.roomStatusDetails.update({
      where: { statusDetailsId: req.body.statusDetailsId },
      data: { occupancy_status: 'OCCUPIED' },
    });

    res.status(200).json({ message: 'Check-in successful', data: tenancyRecord });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: error.message });
  }
};


const checkOut = async (req, res) => {
  const { room_id, tenant_id } = req.body; // Assume these are passed in the request body
  try {
    // Find the tenancy record for the room and tenant
    const tenancyRecord = await prisma.tenancy_records.findFirst({
      where: {
        room_id: room_id,
        tenant_id: tenant_id,
        tenancy_status: 'CHECK_IN', // Only select records where the tenant is currently checked in
      },
    });

    if (!tenancyRecord) {
      return res.status(404).json({ message: 'Tenancy record not found.' });
    }

    // Update the tenancy record to CHECK_OUT
    await prisma.tenancy_records.update({
      where: { record_id: tenancyRecord.record_id },
      data: { tenancy_status: 'CHECK_OUT' },
    });

    // Update the room's occupancy status to 'AVAILABLE'
    await prisma.roomStatusDetails.update({
      where: { room_id: room_id },
      data: { occupancy_status: 'AVAILABLE' },
    });

    // Optionally, update the tenant status or other fields
    // ...

    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};

export { checkOut };


export { checkIn, checkOut };
