import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getUtilityTrends = async (req, res) => {
    const { utilityType, granularity } = req.params;

    const validUtilityTypes = ['water', 'electricity'];
    const validGranularities = ['building', 'room'];
    if (!validUtilityTypes.includes(utilityType.toLowerCase()) || !validGranularities.includes(granularity.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    let query = '';
    if (granularity.toLowerCase() === 'building') {
        query = `SELECT
                    EXTRACT(MONTH FROM billing_date) AS month,
                    EXTRACT(YEAR FROM billing_date) AS year,
                    SUM("${utilityType.toLowerCase()}_usage") AS total_usage,
                    SUM("${utilityType.toLowerCase()}_cost") AS total_cost
                 FROM
                    bills
                 GROUP BY
                    year, month
                 ORDER BY
                    year, month;`;
    } else if (granularity.toLowerCase() === 'room') {
        query = `SELECT
                    room_id,
                    EXTRACT(MONTH FROM billing_date) AS month,
                    EXTRACT(YEAR FROM billing_date) AS year,
                    SUM("${utilityType.toLowerCase()}_usage") AS total_usage,
                    SUM("${utilityType.toLowerCase()}_cost") AS total_cost
                 FROM
                    bills
                 GROUP BY
                    room_id, year, month
                 ORDER BY
                    room_id, year, month;`;
    }

    try {
        const trends = await prisma.$queryRawUnsafe(query);
        res.status(200).json({ message: 'Utility trends fetched successfully', data: trends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export { getUtilityTrends };