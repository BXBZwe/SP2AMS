import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function RoomBillingDetail() {
  const router = useRouter();
  const { roomId } = router.query;
  const [billingDetails, setBillingDetails] = useState(null);

  useEffect(() => {
    if (roomId) {
      const fetchBillingDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/getroombillingdetailforonegenerationdate/${roomId}`);
          setBillingDetails(response.data.detailedBilling);
          console.log("billing details:", response.data.detailedBilling);
        } catch (error) {
          console.error("Error fetching billing details:", error);
        }
      };

      fetchBillingDetails();
    }
  }, [roomId]);

  if (!billingDetails) {
    return <Typography>Loading...</Typography>;
  }

  const formattedTotalBill = parseFloat(billingDetails.total_bill).toFixed(2);

  return (
    <div>
      <Typography variant="h4">Billing Details</Typography>
      <Card>
        <Typography variant="h5">Room {billingDetails.room_number}</Typography>
        <Typography variant="h6">Tenant: {billingDetails.tenant_name}</Typography>
        <Typography variant="body1">Generation Date: {new Date(billingDetails.generation_date).toLocaleDateString()}</Typography>
        <Typography variant="h6">Total Bill: ${formattedTotalBill}</Typography>

        <TableContainer component={Paper}>
          <Table aria-label="billing details">
            <TableHead>
              <TableRow>
                <TableCell>Fee</TableCell>
                <TableCell align="right">Per Unit</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingDetails.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell align="right">{item.per_unit_price}</TableCell>
                  <TableCell align="right">{item.item_name === "Water" || item.item_name === "Electricity" ? billingDetails.meter_reading[`${item.item_name.toLowerCase()}_usage`] : item.quantity}</TableCell>
                  <TableCell align="right">{typeof item.total === "number" ? item.total.toFixed(2) : "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
