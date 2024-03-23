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

function getFinancialSummaryPeriod() {
   const endDate = new Date();
   endDate.setMonth(endDate.getMonth() + 3);
   const startDate = new Date(new Date().setFullYear(endDate.getFullYear() - 1)); // Same date last year

   // Ensuring that times are set to the start or end of the day
   startDate.setHours(0, 0, 0, 0); // Set to start of the day
   endDate.setHours(23, 59, 59, 999); // Set to end of the day

   return { startDate, endDate };
}


const calculateFinancialSummary = async (req, res) => {
   const { startDate, endDate } = getFinancialSummaryPeriod();

   const totalRevenue = await prisma.bills.aggregate({
      _sum: {
         total_amount: true,
      },
      where: {
         AND: [
            { billing_date: { gte: new Date(startDate) } },
            { billing_date: { lte: new Date(endDate) } },
         ],
      },
   });

   const totalCosts = await prisma.bills.aggregate({
      _sum: {
         water_cost: true,
         electricity_cost: true,
      },
      where: {
         AND: [
            { billing_date: { gte: new Date(startDate) } },
            { billing_date: { lte: new Date(endDate) } },
         ],
      },
   });

   const calculatedCosts = Number(totalCosts._sum.water_cost) + Number(totalCosts._sum.electricity_cost);

   const profit = Number(totalRevenue._sum.total_amount) - Number(calculatedCosts);

   const financialSummary = {
      revenue: Number(totalRevenue._sum.total_amount),
      costs: calculatedCosts,
      profit: profit,
   };

   res.status(200).json({ message: 'Financial Summary fetched successfully', financialSummary });

}

const getFinancialTrends = async (req, res) => {
   const { timeUnit, yearsRange } = req.query;

   const validTimeUnits = ['month', 'year'];
   if (!validTimeUnits.includes(timeUnit)) {
      return res.status(400).json({ error: 'Invalid time unit' });
   }
   if (timeUnit === 'year' && (isNaN(yearsRange) || yearsRange < 1)) {
      return res.status(400).json({ error: 'Invalid years range' });
   }

   let query = '';
   if (timeUnit === 'month') {
      query = `SELECT
                    EXTRACT(MONTH FROM billing_date) AS month,
                    EXTRACT(YEAR FROM billing_date) AS year,
                    SUM(total_amount) AS revenue,
                    SUM(water_cost + electricity_cost) AS costs,
                    SUM(total_amount) - SUM(water_cost + electricity_cost) AS profit
                 FROM
                    bills
                 WHERE
                    billing_date >= CURRENT_DATE - INTERVAL '1 YEAR'
                 GROUP BY
                    year, month
                 ORDER BY
                    year, month;`;
   } else if (timeUnit === 'year') {
      query = `SELECT
                    EXTRACT(YEAR FROM billing_date) AS year,
                    SUM(total_amount) AS revenue,
                    SUM(water_cost + electricity_cost) AS costs,
                    SUM(total_amount) - SUM(water_cost + electricity_cost) AS profit
                 FROM
                    bills
                 WHERE
                    billing_date >= CURRENT_DATE - INTERVAL '${yearsRange} YEARS'
                 GROUP BY
                    year
                 ORDER BY
                    year;`;
   }

   try {
      const trends = await prisma.$queryRawUnsafe(query);
      res.status(200).json({ message: 'Financial trends fetched successfully', data: trends });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

export { getUtilityTrends, calculateFinancialSummary, getFinancialTrends };