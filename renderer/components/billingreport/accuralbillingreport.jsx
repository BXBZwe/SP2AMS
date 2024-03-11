import React, { useState, useEffect } from "react";
import { TextField, Card, CardContent, Typography, Button, Box, TableContainer, Table, TableCell, TableRow, TableHead, TableBody, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

export default function AccrualBillingReport() {
  const theme = useTheme();
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rateItems, setRateItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRateItems();
  }, []);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleDisplayReportClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/accrual-report/${year}`);
      if (response.data && Array.isArray(response.data)) {
        setReportData(response.data);
      } else {
        console.error("Invalid response data:", response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accrual billing report:", error);
      setLoading(false);
    }
  };

  const fetchRateItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getallrates");
      setRateItems(response.data.getRate);
    } catch (error) {
      console.error("Error fetching rate items:", error);
    }
  };

  const handleGeneratePdfClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/generateaccuralbillingreport/${year}`, { responseType: "blob" });
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `Accrual_Billing_Report_${year}.pdf`);
      document.body.appendChild(fileLink);
      fileLink.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <Card sx={{ width: "100%", marginBottom: theme.spacing(4) }}>
        <CardContent>
          <Typography variant="h4">Accrual Billing Report</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Reporting bill and its full summary for the selected year
          </Typography>
          <Box sx={{ display: "flex", gap: theme.spacing(2), alignItems: "center", marginTop: theme.spacing(2) }}>
            <TextField label="Year" type="number" value={year} onChange={handleYearChange} InputLabelProps={{ shrink: true }} />
            <Button variant="contained" onClick={handleDisplayReportClick} disabled={loading}>
              {loading ? "Loading..." : "Display"}
            </Button>
            <Button variant="contained" color="primary" onClick={handleGeneratePdfClick} disabled={loading || reportData.length === 0}>
              Generate PDF
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {reportData.length > 0 && (
        <TableContainer component={Paper}>
          <Box sx={{ display: "flex", gap: theme.spacing(2), alignItems: "center", marginTop: theme.spacing(2) }}>
            <TextField
              fullWidth
              label="Search (Room Number or Tenant Name)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Other buttons like Display and Generate PDF */}
          </Box>
          <Table>
            
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Tenant Name</TableCell>
                {rateItems.map((item) => (
                  <TableCell key={item.rate_id}>{item.item_name}</TableCell>
                ))}
                <TableCell>Total Bill</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {reportData
                .filter((data) => {
                  return data.roomNumber.toString().includes(searchQuery) || data.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.roomNumber}</TableCell>
                    <TableCell>{data.tenantName}</TableCell>
                    {rateItems.map((rate) => (
                      <TableCell key={rate.rate_id}>{data.rateItems[rate.item_name] || 0}</TableCell>
                    ))}
                    <TableCell>{data.totalBill}</TableCell>
                  </TableRow>
                ))}
            </TableBody>

          </Table>
        </TableContainer>
      )}
    </>
  );
}
