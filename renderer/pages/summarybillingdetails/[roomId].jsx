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
  const [currentReading, setCurrentReadings] = useState({ water_reading: 0, electricity_reading: 0 });

  useEffect(() => {
    if (roomId) {
      const fetchBillingDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/getroombillingdetailforonegenerationdate/${roomId}`);
          setBillingDetails({ ...response.data.detailedBilling, room_id: response.data.room_id, bill_id: response.data.bill_id });

          const currentMeterReading = response.data.detailedBilling.meter_reading;
          setCurrentReadings({
            water_reading: currentMeterReading.water_reading,
            electricity_reading: currentMeterReading.electricity_reading,
          });

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
    if (itemName === "Water" || itemName === "Electricity") {
      if (name === "previous_reading") {
        setPreviousReading((prev) => ({
          ...prev,
          [`${itemName.toLowerCase()}_reading`]: value,
        }));
      } else if (name === "current_reading") {
        setCurrentReadings((prev) => ({
          ...prev,
          [`${itemName.toLowerCase()}_reading`]: value,
        }));
      }
    } else {
      setSelectedRate((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (!selectedRate || !roomId) return;

    const adjustmentData = {
      rate_id: selectedRate.rate_id,
      room_id: billingDetails.room_id,
      bill_id: billingDetails.bill_id,
      temporary_price: Number(selectedRate.per_unit_price),
      generationDate: billingDetails.generation_date,
    };

    try {
      const adjustmentResponse = await axios.post(`http://localhost:3000/applytemporaryRateAdjustment`, adjustmentData);
      if (adjustmentResponse.status === 200) {
        console.log("Temporary rate adjustment saved successfully:", adjustmentResponse.data);
      } else {
        console.error("Failed to save the temporary rate adjustment");
      }

      const updateData = {
        bill_id: billingDetails.bill_id,
        previousWaterReading: Number(previousReading.water_reading),
        previousElectricityReading: Number(previousReading.electricity_reading),
        currentWaterReading: Number(currentReading.water_reading),
        currentElectricityReading: Number(currentReading.electricity_reading),
      };

      try {
        const updatedBillResponse = await axios.post(`http://localhost:3000/recalculatebillandupdate`, updateData);

        if (updatedBillResponse.status === 200) {
          setBillingDetails((prev) => ({ ...prev, ...updatedBillResponse.data.updatedBill }));
          console.log(" Updated the recalculated bill:", updatedBillResponse);
        } else {
          console.error("Failed to recalculate the bill");
        }
      } catch (error) {
        console.error("Error during bill recalculation:", error);
      }
    } catch (error) {
      console.error("Error saving the temporary rate adjustment:", error);
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
                    <TableCell align="right">Price Per Unit</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingDetails.items.map((item, index) => {
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
                <TextField label="Price Per Unit" type="number" value={selectedRate.per_unit_price} onChange={(e) => handleChange("per_unit_price", e.target.value)} margin="normal" fullWidth />
                {selectedRate && (selectedRate.item_name === "Water" || selectedRate.item_name === "Electricity") && (
                  <>
                    <TextField label="Previous Meter Reading" type="number" value={previousReading[`${selectedRate.item_name.toLowerCase()}_reading`]} onChange={(e) => handleChange("previous_reading", e.target.value, selectedRate.item_name)} margin="normal" fullWidth />
                    <TextField label="Current Meter Reading" type="number" value={currentReading[`${selectedRate.item_name.toLowerCase()}_reading`]} onChange={(e) => handleChange("current_reading", e.target.value, selectedRate.item_name)} margin="normal" fullWidth />
                  </>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button variant="outlined">Cancel</Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
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
