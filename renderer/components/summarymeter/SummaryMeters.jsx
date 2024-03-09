import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Select, MenuItem, FormControl, InputLabel, Button, TextField
} from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs"; // Ensure dayjs is imported

export default function SummaryMeter() {
  
  const [billType, setBillType] = useState('electricity');
  const data = {
    electricity: [
      { roomID: '102', amount: '4,000' },
      { roomID: '103', amount: '2,000' },
      { roomID: '104', amount: '4,000' },
      { roomID: '105', amount: '2,000' },
      { roomID: '106', amount: '4,000' },
      { roomID: '201', amount: '2,000' },
      { roomID: '203', amount: '4,000' },
      { roomID: '204', amount: '2,000' },
      { roomID: '205', amount: '4,000' },
      { roomID: '206', amount: '2,000' },
      { roomID: '207', amount: '4,000' },
      { roomID: '208', amount: '2,000' },
      { roomID: '302', amount: '4,000' },
      { roomID: '303', amount: '2,000' },
      { roomID: '402', amount: '4,000' },
      { roomID: '403', amount: '2,000' }
    ],
    water: [
      { roomID: '102', amount: '1,500' },
      { roomID: '103', amount: '1,000' },
      { roomID: '104', amount: '1,200' },
      { roomID: '105', amount: '800' },
      { roomID: '106', amount: '1,600' },
      { roomID: '201', amount: '1,100' },
      { roomID: '203', amount: '1,500 ' },
      { roomID: '204', amount: '950 ' },
      { roomID: '205', amount: '1,700 ' },
      { roomID: '206', amount: '1,050 ' },
      { roomID: '207', amount: '1,500' },
      { roomID: '208', amount: '900 ' },
      { roomID: '302', amount: '1,600 ' },
      { roomID: '303', amount: '1,100 ' },
      { roomID: '402', amount: '1,700' },
      { roomID: '403', amount: '950 ' }
    ]
  };

  const handleChange = (event) => {
    setBillType(event.target.value);
  };
  const meterData = {
    '1st Floor': [
      { room: '101', previousMeasure: '532', currentMeasure: '532' },
      { room: '102', previousMeasure: '4492', currentMeasure: '4492' },
      // ... add other rooms
    ],
    '2nd Floor': [
      { room: '101', previousMeasure: '532', currentMeasure: '532' },
      { room: '102', previousMeasure: '4492', currentMeasure: '4492' },
      // ... add other rooms
    ],
    '3rd Floor': [
      { room: '101', previousMeasure: '532', currentMeasure: '532' },
      { room: '102', previousMeasure: '4492', currentMeasure: '4492' },
      // ... add other rooms
    ],
    '4th Floor': [
      { room: '101', previousMeasure: '532', currentMeasure: '532' },
      { room: '102', previousMeasure: '4492', currentMeasure: '4492' },
      // ... add other rooms
    ],
    '5th Floor': [
      { room: '101', previousMeasure: '532', currentMeasure: '532' },
      { room: '102', previousMeasure: '4492', currentMeasure: '4492' },
      // ... add other rooms
    ],
    '6th Floor': [
      { room: '101', previousMeasure: '532', currentMeasure: '532' },
      { room: '102', previousMeasure: '4492', currentMeasure: '4492' },
      // ... add other rooms
    ],
    // ... add other floors
  };
  const [selectedType, setSelectedType] = useState('Water Bill');;

  const handleSelectChange = (event) => {
    setSelectedType(event.target.value);
  };

  const [billingDate, setBillingDate] = useState(dayjs());
  const [generateButtonClicked, setGenerateButtonClicked] = useState(false);

  const handleBillingDateChange = (newValue) => {
    setBillingDate(newValue);
  };



  const handleGenerateClick = () => {
    setGenerateButtonClicked(true);
    // Implement generation logic here
  };
  return (
    <>
     <LocalizationProvider dateAdapter={AdapterDayjs}>
     <Card sx={{ width: "100%", marginBottom: "20px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardContent>
          <Typography variant="h4">Meter and Water</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, marginBottom: 1 }}>
            View the electricity meter and water usage of each room in an apartment.
          </Typography>
          <Button sx={{}} variant="contained" onClick={handleGenerateClick}>Generate PDF</Button>
         
        </CardContent>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
         <DatePicker
            label="Generation Date"
            inputFormat="MM/DD/YYYY"
            value={billingDate}
            onChange={handleBillingDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <Select
            value={selectedType}
            onChange={handleSelectChange}
            displayEmpty
            sx={{minWidth: '200px'}}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={'Water Bill'}>Water Bill</MenuItem>
            <MenuItem value={'Electricity Bill'}>Electricity Bill</MenuItem>
          </Select>
          
        </CardContent>
        
      </Card>
      
</LocalizationProvider>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, m: 1, flexWrap: 'wrap' }}>
        <Card sx={{ width: "100%", margin: "0 20px 20px 0" }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {Object.keys(meterData).map((floor, index) => (
                <Box sx={{ width: '48%' }} key={index}>
                  <Typography variant="h5">{floor}</Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 440, overflow: 'auto', marginBottom: '20px' }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell variant="head">Room</TableCell>
                          <TableCell variant="head" align="right">Previous Measure</TableCell>
                          <TableCell variant="head" align="right">Current Measure</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {meterData[floor].map((item, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {item.room}
                            </TableCell>
                            <TableCell align="right">{item.previousMeasure}</TableCell>
                            <TableCell align="right">{item.currentMeasure}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
