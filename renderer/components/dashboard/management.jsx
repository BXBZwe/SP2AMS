import React from "react";
import OccupancyPie from "./management/occupancyPie";
import RequestChart from "./management/requestChart";
import PaymentStatus from "./management/paymentStatus";
import { Box } from "@mui/material";
export default function Management() {
  return (
    <>
      <Box sx={{ display: "flex", marginTop: "20px" }}>
        <Box>
          <OccupancyPie />
        </Box>
        <Box sx={{ width: "100%", marginLeft: "10px" }}>
          <RequestChart />
        </Box>
      </Box>
      <Box sx={{ display: "flex", marginTop: "20px" }}>
      <PaymentStatus />

      </Box>
    </>
  );
}
