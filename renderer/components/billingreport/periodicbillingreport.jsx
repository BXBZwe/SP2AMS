import React, { useState, useEffect } from "react";
import { TextField, Card, CardContent, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, Box, TableContainer, Table, TableCell, TableRow, TableHead, TableBody, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";


export default function PeriodicBillingReport() {
  const theme = useTheme();
  const [periodicReport, setPeriodicReport] = useState({
    fromDate: null,
    toDate: null,
    showBills: false,
    showTaxInvoice: false,
    showUnpaidBills: false,
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rateItems, setRateItems] = useState([]);
  const [isDataDisplayed, setIsDataDisplayed] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Added search state


  useEffect(() => {
    fetchRateItems();
  }, []);


    // const handlePeriodicReportChange = (prop) => (event) => {
    //   const value = prop === "showBills" || prop === "showTaxInvoice" || prop === "showUnpaidBills" ? event.target.checked : event.target.value;
    //   setPeriodicReport({ ...periodicReport, [prop]: value });
    // };
    const handlePeriodicReportChange = (prop) => (newValue) => {
      setPeriodicReport({ ...periodicReport, [prop]: newValue });
    };
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDisplayReportClick = async () => {
    if (periodicReport.showBills && periodicReport.fromDate && periodicReport.toDate) {
      setLoading(true);
      try {
        const formattedFromDate = periodicReport.fromDate;
        const formattedToDate = periodicReport.toDate;

        const response = await axios.get("http://localhost:3000/billing-report", {
          params: {
            from: formattedFromDate,
            to: formattedToDate,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          const rateNames = rateItems.map((item) => item.item_name);
          const newReportData = response.data.map((data) => {
            const rateData = rateNames.reduce((acc, rateName) => {
              acc[rateName] = data.rateItems[rateName] || 0;
              return acc;
            }, {});

            return {
              ...data,
              rateItems: rateData,
            };
          });

          setReportData(newReportData);
        } else {
          console.error("Invalid response data:", response.data);
        }
        setLoading(false);
        setIsDataDisplayed(true);
      } catch (error) {
        console.error("Error fetching billing report:", error);
        setLoading(false);
      }
    } else {
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

  // const handleGeneratePdfClick = async () => {
  //   const { fromDate, toDate } = periodicReport;
  //   try {
  //     const response = await axios.get(`http://localhost:3000/generate-periodic-report-pdf/${fromDate}/${toDate}`, { responseType: "blob" });
  //     const fileURL = window.URL.createObjectURL(new Blob([response.data]));
  //     const fileLink = document.createElement("a");
  //     fileLink.href = fileURL;
  //     fileLink.setAttribute("download", `Periodic_Report_${fromDate}_to_${toDate}.pdf`);
  //     document.body.appendChild(fileLink);
  //     fileLink.click();
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  const handleGenerateExcelClick = async () => {
    const { fromDate, toDate } = periodicReport;
    try {
      const response = await axios.get(`http://localhost:3000/generate-periodic-report-excel/${fromDate}/${toDate}`, { responseType: "blob" });
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `Periodic_Report_${fromDate}_to_${toDate}.xlsx`);
      document.body.appendChild(fileLink);
      fileLink.click();
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  return (
    <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: "100%", marginBottom: "20px" }}>
        <CardContent>
        
          <Typography variant="h4">Periodic Billing Report</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Reporting bill and its full summary
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: theme.spacing(4), marginBottom: theme.spacing(4) }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box flexGrow={1}>
              <Typography variant="h5" gutterBottom>
                Periodic Report
              </Typography>
              {/* <Box sx={{ display: "flex", gap: theme.spacing(2), alignItems: "center", marginBottom: theme.spacing(2) }}>
                <TextField label="From" type="date" value={periodicReport.fromDate} onChange={handlePeriodicReportChange("fromDate")} InputLabelProps={{ shrink: true }} />
                <TextField label="To" type="date" value={periodicReport.toDate} onChange={handlePeriodicReportChange("toDate")} InputLabelProps={{ shrink: true }} />
              </Box> */}
                      <Box sx={{ display: 'flex', gap: theme.spacing(2), alignItems: 'center', marginBottom: theme.spacing(2) }}>
          <DatePicker
            label="From"
            value={periodicReport.fromDate}
            onChange={handlePeriodicReportChange('fromDate')}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="To"
            value={periodicReport.toDate}
            onChange={handlePeriodicReportChange('toDate')}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={periodicReport.showBills} onChange={handlePeriodicReportChange("showBills")} />} label="Show Bills" />
              </FormGroup>
            </Box>
            <Box sx={{ gap: theme.spacing(2), justifyContent: "space-between", marginTop: theme.spacing(2) }}>
              <Button variant="contained" onClick={handleDisplayReportClick} disabled={loading} sx={{ margin: "10px", width: "150px" }}>
                {loading ? "Loading..." : "Display"}
              </Button>
              <Button variant="contained" color="primary" onClick={handleGenerateExcelClick} disabled={!isDataDisplayed || loading} sx={{ width: "155px" }}>
                Generate Excel
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {reportData.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: theme.spacing(4) }}>
          <TextField
              fullWidth
              label="Search (Room Number or Tenant Name)"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{ marginTop: theme.spacing(2) }}
            
            />
          <Table>
            <TableHead>
            
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Tenant Name</TableCell>
                {rateItems.map((rate) => (
                  <TableCell key={rate.rate_id}>{rate.item_name}</TableCell>
                ))}
                <TableCell>Total Bill</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData
                .filter((data) =>
                  data.roomNumber.toString().includes(searchQuery) ||
                  data.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((data, index) => (
                  <TableRow key={index}>
                  <TableCell>{data.roomNumber}</TableCell>
                  <TableCell>{data.tenantName}</TableCell>
                  {rateItems.map((rate) => (
                    <TableCell key={rate.rate_id}>{data.rateItems?.[rate.item_name] ?? 0}</TableCell>
                  ))}
                  <TableCell>{data.totalBill}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </LocalizationProvider>

    </>
  );
}
