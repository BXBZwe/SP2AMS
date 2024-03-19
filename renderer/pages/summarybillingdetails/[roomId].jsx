import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";

export default function RoomBillingDetail() {
  const router = useRouter();
  const { roomId } = router.query;
  const [billingDetails, setBillingDetails] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [previousReading, setPreviousReading] = useState({ water_reading: 0, electricity_reading: 0 });

  useEffect(() => {
    if (roomId) {
      const fetchBillingDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/getroombillingdetailforonegenerationdate/${roomId}`);
          setBillingDetails(response.data.detailedBilling);
          const generationDate = response.data.detailedBilling.generation_date;
          const previousReadingResponse = await axios.get(`http://localhost:3000/getLastReadingBeforeDate/${roomId}?generation_date=${generationDate}`);
          setPreviousReading(previousReadingResponse.data.data);
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

  const handleRateSelect = (item) => {
    setSelectedRate({ ...item });
  };

  const handleChange = (name, value, itemName = null) => {
    if (name === "meter_reading" && (itemName === "Water" || itemName === "Electricity")) {
      setBillingDetails((prevDetails) => ({
        ...prevDetails,
        meter_reading: {
          ...prevDetails.meter_reading,
          [`${itemName.toLowerCase()}_usage`]: value,
          [`${itemName.toLowerCase()}_reading`]: value,
        },
      }));
    } else {
      setSelectedRate((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <Typography variant="h4">Summary Billing Details</Typography>
            <Box sx={{ width: 300, maxWidth: "100%" }}>
              {" "}
              <Typography variant="body1">
                <b>Generation Date:</b> {new Date(billingDetails.generation_date).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <div style={{ minHeight: 400, width: "100%" }}>
        <Card sx={{ width: "100%", padding: 1 }}>
          <CardContent>
            <Typography variant="p" sx={{ padding: 1 }}>
              <b>Tenant:</b> {billingDetails.tenant_name},
            </Typography>
            <Typography variant="p">
              <b>Room:</b> {billingDetails.room_number}
            </Typography>
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
                  {billingDetails.items.map((item, index) => {
                    // Adjustments for water and electricity rows
                    let quantity, total;
                    if (item.item_name === "Water" || item.item_name === "Electricity") {
                      quantity = billingDetails.meter_reading[`${item.item_name.toLowerCase()}_usage`];
                      total = parseFloat(billingDetails.meter_reading[`${item.item_name.toLowerCase()}_cost`]).toFixed(2);
                    } else {
                      quantity = item.quantity;
                      total = item.total.toFixed(2);
                    }

                    return (
                      <TableRow key={index} hover onClick={() => handleRateSelect(item)}>
                        <TableCell>{item.item_name}</TableCell>
                        <TableCell align="right">{item.per_unit_price}</TableCell>
                        <TableCell align="right">{quantity}</TableCell>
                        <TableCell align="right">{total}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {selectedRate && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">{selectedRate.item_name} Details</Typography>
                <TextField
                  label="Quantity"
                  type="number"
                  value={selectedRate.item_name === "Water" || selectedRate.item_name === "Electricity" ? billingDetails.meter_reading[`${selectedRate.item_name.toLowerCase()}_usage`] : selectedRate.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  margin="normal"
                  fullWidth
                  InputProps={selectedRate.item_name === "Water" || selectedRate.item_name === "Electricity" ? { readOnly: true } : {}}
                />
                <TextField label="Per Unit" type="number" value={selectedRate.per_unit_price} onChange={(e) => handleChange("per_unit_price", e.target.value)} margin="normal" fullWidth />
                {selectedRate.item_name === "Water" || selectedRate.item_name === "Electricity" ? (
                  <>
                    <TextField label="Previous Meter Reading" value={previousReading[`${selectedRate.item_name.toLowerCase()}_reading`]} margin="normal" fullWidth InputProps={{ readOnly: true }} />
                    <TextField label="Current Meter Reading" value={billingDetails.meter_reading[`${selectedRate.item_name.toLowerCase()}_reading`]} margin="normal" fullWidth InputProps={{ readOnly: true }} />
                  </>
                ) : null}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button variant="outlined">Cancel</Button>
                  <Button variant="contained" color="primary">
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </div>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">
          Total Bill: {"\u0E3F"}
          {formattedTotalBill}
        </Typography>
      </Box>
    </>
  );
}
