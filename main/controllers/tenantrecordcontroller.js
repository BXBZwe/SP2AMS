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
        deposit: req.body.deposit
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

    await prisma.tenants.update({
      where: {
        tenant_id: req.body.tenant_id
      },
      data: {
        contract_status: "NEW",
        roomBaseDetailsRoom_id: req.body.room_id
      }
    })

    res.status(200).json({ message: 'Check-in successful', data: tenancyRecord });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};


const getaTenancyrecord = async (req, res) => {
  const room_id = parseInt(req.params.roomId, 10);
  console.log("Passed Room id", room_id);
  if (isNaN(room_id)) {
    return res.status(400).json({ message: 'Room ID must be a valid number.' });
  }

  try {
    const tenancyRecord = await prisma.tenancy_records.findFirst({
      where: {
        room_id: room_id,
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


const checkOut = async (req, res) => {
  console.log("check out: ", req.body);
  const { roomNumber, tenant_id } = req.body;
  const room_id = roomNumber
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

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of the day for comparison
    const moveOutDate = new Date(tenancyRecord.move_out_date);
    moveOutDate.setHours(0, 0, 0, 0); // Normalize move-out date to start of the day for comparison

    let contractStatusUpdate;
    if (moveOutDate.getTime() === currentDate.getTime()) {
      contractStatusUpdate = 'CHECKED_OUT';
    } else if (currentDate.getTime() < moveOutDate.getTime()) {
      contractStatusUpdate = 'TERMINATED';
    }

    console.log("Room ID",room_id)
    const roomstatus = await prisma.roomBaseDetails.findUnique({
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

    console.log( "Status ID to Update",roomstatus.statusDetailsId)
    await prisma.roomStatusDetails.update({
      where: { status_id: roomstatus.statusDetailsId },
      data: { occupancy_status: 'VACANT', is_reserved: false },
    });

    if (contractStatusUpdate) {
      await prisma.tenants.update({
        where: { tenant_id: tenant_id },
        data: {
          contract_status: contractStatusUpdate,
          RoomBaseDetails: {
            disconnect: true, // This will remove the association with the room
          },
        },
      });
    }


    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};


const getAllTenancyRecords = async (req, res) => {
  try {
    const records = await prisma.tenancy_records.findMany({
      include: {
        RoomBaseDetails: true, 
      }
    });
    res.status(200).json(records);
  } catch (error) {
    console.error("Failed to fetch tenancy records:", error);
    res.status(500).json({ error: "Failed to fetch tenancy records" });
  }
};

export { checkIn, checkOut, getaTenancyrecord,getAllTenancyRecords };