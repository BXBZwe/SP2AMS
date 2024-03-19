import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Input, Box, Button, FormControl, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";

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
    <>
      <Card sx={{ marginBottom: 2 }
      }>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="h4">Billing Details</Typography>
            <Box sx={{ width: 300, maxWidth: '100%' }}> {/* Adjust the width as needed */}
              <Typography variant="body1"><b>Generation Date:</b> {new Date(billingDetails.generation_date).toLocaleDateString()}</Typography>

            </Box>
          </Box>
        </CardContent>
      </Card>

      <div style={{ minHeight: 400, width: "100%" }}>

        <Card sx={{ width: "100%", padding: 1 }}>
          <Card>

            <Typography variant="p" sx={{ padding: 1 }}><b>Tenant:</b> {billingDetails.tenant_name},</Typography>
            <Typography variant="p"><b>Room:</b> {billingDetails.room_number}</Typography>


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

                  <Box className="electricity-bill-form" sx={{ width: "100%", p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, width: '100%' }}>Electricity Bill</Typography>
                    <Box className="meter-readings" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
                      <Typography>Meter:</Typography>
                      <TextField
                        type="text"
                        className="meter-start"
                        value="33666"
                        InputProps={{ readOnly: true }}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', height: 'auto', padding: '8px 12px', width: '40px' } }}
                      />
                      <Typography>-</Typography>
                      <TextField
                        type="text"
                        className="meter-end"
                        value="33969"
                        InputProps={{ readOnly: true }}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', height: 'auto', padding: '8px 12px', width: '40px'  } }}
                      />
                    </Box>
                    <Box className="quantity" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
                      <Typography>Quantity:</Typography>
                      <TextField
                        type="text"
                        value="303"
                        InputProps={{ readOnly: true }}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', height: 'auto', padding: '8px 12px' } }}
                      />
                    </Box>
                    <Box className="unit-price" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
                      <Typography>Per unit:</Typography>
                      <TextField
                        type="text"
                        value="700"
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', height: 'auto', padding: '8px 12px' } }}
                      />
                    </Box>
                    <Box className="total" sx={{ pt: 1, width: '100%' }}>
                      <Typography><b>Total Bill:</b> ${formattedTotalBill}</Typography>
                    </Box>
                    <Box className="actions" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1, width: '100%' }}>
                      <Button variant="outlined" sx={{ width: "100px", height: "36px", fontSize: '0.75rem' }}>Cancel</Button>
                      <Button variant="contained" sx={{ width: "100px", height: "36px", fontSize: '0.75rem' }}>Save</Button>
                    </Box>
                  </Box>


                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Card>
      </div>
    </>
  );
}
