import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const checkIn = async (req, res) => {
  console.log("requested body:", req.body)
  try {
    const tenancyRecord = await prisma.tenancy_records.create({
      data: {
        tenant_id: req.body.tenant_id,
        room_id: req.body.room_id,
        move_in_date: req.body.move_in_date,
        move_out_date: req.body.move_out_date,
        period_of_stay: req.body.period_of_stay,
        deposit_returned: req.body.deposit
      }
    });

    const room = await prisma.roomBaseDetails.findUnique({
      where: {
        room_id: req.body.room_id,
      },
      select: {
        statusDetailsId: true
      }
    });

    if (!room || room.statusDetailsId === undefined) {
      throw new Error("Room or statusDetailsId not found");
    }


    await prisma.roomStatusDetails.update({
      where: {
        status_id: room.statusDetailsId,
      },
      data: {
        occupancy_status: "OCCUPIED"
      }
    });

    res.status(200).json({ message: 'Check-in successful', data: tenancyRecord });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};


const checkOut = async (req, res) => {
  console.log("check out: ", req.body);
  const { room_id, tenant_id } = req.body;
  try {
    const tenancyRecord = await prisma.tenancy_records.findFirst({
      where: {
        room_id: room_id,
        tenant_id: tenant_id,
        tenancy_status: 'CHECK_IN',
      },
    });

    if (!tenancyRecord) {
      return res.status(404).json({ message: 'Tenancy record not found.' });
    }

    const roomstatus = await prisma.roomBaseDetails.findFirst({
      where: {
        room_id: room_id,
      },
      select: {
        statusDetailsId: true
      }
    });

    if (!roomstatus || roomstatus.statusDetailsId === undefined) {
      throw new Error("Room or statusDetailsId not found");
    }

    await prisma.tenancy_records.update({
      where: { record_id: tenancyRecord.record_id },
      data: { tenancy_status: 'CHECK_OUT' },
    });

    await prisma.roomStatusDetails.update({
      where: { status_id: roomstatus.statusDetailsId },
      data: { occupancy_status: 'OCCUPIED', is_reserved: false },
    });

    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getaTenancyrecord = async (req, res) => {
  const room_id = parseInt(req.params.roomId, 10); // Make sure to parse the roomId parameter to an integer
  console.log("Passed Room id", room_id);
  if (isNaN(room_id)) {
    return res.status(400).json({ message: 'Room ID must be a valid number.' });
  }

  try {
    const tenancyRecord = await prisma.tenancy_records.findFirst({
      where: {
        room_id: room_id, // Directly use room_id here
        tenancy_status: 'CHECK_IN',
      },
      include: {
        tenants: true,
      },
    });

    if (!tenancyRecord) {
      return res.status(404).json({ message: 'No active tenancy record found for this room.' });
    }

    return res.status(200).json(tenancyRecord);
  } catch (error) {
    console.error('Error fetching tenancy record:', error);
    return res.status(500).json({ error: error.message });
  }
};


export { checkIn, checkOut, getaTenancyrecord };
