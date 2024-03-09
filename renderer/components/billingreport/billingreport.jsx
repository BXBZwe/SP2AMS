import React, { useState } from "react";
import { TextField, Card, CardContent, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function BillingReport() {
  const theme = useTheme();
  const [periodicReport, setPeriodicReport] = useState({
    fromDate: "",
    toDate: "",
    showBills: false,
    showTaxInvoice: false,
    showUnpaidBills: false,
  });

  const [accrualReport, setAccrualReport] = useState({
    showUnpaidBills: false,
  });

  // Handle change for Periodic Report
  const handlePeriodicReportChange = (prop) => (event) => {
    setPeriodicReport({ ...periodicReport, [prop]: event.target.value });
  };

  // Handle change for Accrual Report
  const handleAccrualReportChange = (event) => {
    setAccrualReport({ ...accrualReport, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <Card sx={{ width: "100%", marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h4">Billing Report</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Reporting bill and its full summary
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: theme.spacing(4), marginBottom: theme.spacing(4) }}>
        <Card sx={{ flex: 1 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box flexGrow={1}>
                <Typography variant="h5" gutterBottom>Periodic Report</Typography>
                <Box sx={{ display: 'flex', gap: theme.spacing(2), alignItems: 'center', marginBottom: theme.spacing(2) }}>
              <TextField
                label="From"
                type="date"
                value={periodicReport.fromDate}
                onChange={handlePeriodicReportChange('fromDate')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="To"
                type="date"
                value={periodicReport.toDate}
                onChange={handlePeriodicReportChange('toDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={periodicReport.showBills} onChange={handlePeriodicReportChange('showBills')} />} label="Show Bills" />
              <FormControlLabel control={<Checkbox checked={periodicReport.showTaxInvoice} onChange={handlePeriodicReportChange('showTaxInvoice')} />} label="Show Tax Invoice" />
              <FormControlLabel control={<Checkbox checked={periodicReport.showUnpaidBills} onChange={handlePeriodicReportChange('showUnpaidBills')} />} label="Show Unpaid Bills" />
            </FormGroup>
            </Box>
            <Button variant="contained" sx={{ alignSelf: 'flex-end', marginTop: theme.spacing(2) }}>Display</Button>
        </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box flexGrow={1}>
            <Typography variant="h5" gutterBottom>Accrual Report</Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox name="showUnpaidBills" checked={accrualReport.showUnpaidBills} onChange={handleAccrualReportChange} />} label="Show Unpaid Bills" />
            </FormGroup>
        </Box>
        <Button variant="contained" sx={{ alignSelf: 'flex-end', marginTop: theme.spacing(2) }}>Display</Button>
        </CardContent>
        </Card>
      </Box>
    </>
  );
}
