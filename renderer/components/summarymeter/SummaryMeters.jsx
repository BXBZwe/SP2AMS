import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Select, MenuItem, FormControl, InputLabel, Button, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";

export default function SummaryMeter() {
  const [billType, setBillType] = useState("electricity");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [generationDates, setGenerationDates] = useState([]);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");
  const [meterData, setMeterData] = useState({});

  const handleGenerationDateChange = (event) => {
    setSelectedGenerationDate(event.target.value);
  };

  const handleBillTypeChange = (event) => {
    setBillType(event.target.value);
  };

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getallrooms");
      setSelectedRooms(response.data.getrooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const getPreviousMeterReading = async (roomId, generationDate) => {
    try {
      const response = await axios.get(`http://localhost:3000/getLastReadingBeforeDate/${roomId}`, {
        params: { generation_date: generationDate },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching previous meter reading for room:", roomId, error);
      return null;
    }
  };

  const getCurrentReading = async (roomId, generationDate) => {
    try {
      const response = await axios.get(`http://localhost:3000/getCurrentReading/${roomId}`, {
        params: { generation_date: generationDate },
      });

      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        return { water_reading: 0, electricity_reading: 0 };
      }
    } catch (error) {
      console.error("Error fetching current meter reading for room:", roomId, error);
      return { water_reading: 0, electricity_reading: 0 };
    }
  };

  const fetchGenerationDates = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getgenerationdate");
      if (response.data && Array.isArray(response.data.dates)) {
        setGenerationDates(response.data.dates);
        setSelectedGenerationDate(response.data.dates[0]);
      } else {
        console.error("Generation dates response is not an array:", response.data.dates);
        setGenerationDates([]);
      }
    } catch (error) {
      console.error("Failed to fetch generation dates:", error);
    }
  };

  const fetchReadings = async () => {
    if (selectedGenerationDate) {
      const readings = await Promise.all(
        selectedRooms.map(async (room) => {
          const currentReading = await getCurrentReading(room.room_id, selectedGenerationDate);
          console.log("Current Reading", currentReading);

          if (currentReading && currentReading.reading_date && currentReading.reading_date.startsWith(selectedGenerationDate)) {
            const previousReading = await getPreviousMeterReading(room.room_id, selectedGenerationDate);
            return {
              room_id: room.room_id,
              room_number: room.room_number,
              floor: `Floor ${room.floor}`,
              currentReading: currentReading[`${billType}_reading`],
              previousReading: previousReading[`${billType}_reading`],
              currentReadingDate: currentReading.reading_date,
            };
          }
          return null;
        })
      );

      const validReadings = readings.filter((reading) => reading !== null);
      const meterDataByFloor = validReadings.reduce((acc, reading) => {
        const floor = reading.floor;
        if (!acc[floor]) {
          acc[floor] = [];
        }
        acc[floor].push({
          room: reading.room_number,
          previousMeasure: reading.previousReading,
          currentMeasure: reading.currentReading,
        });
        return acc;
      }, {});

      setMeterData(meterDataByFloor);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
    fetchGenerationDates();
  }, []);
  useEffect(() => {
    if (selectedGenerationDate && billType) {
      fetchReadings();
    }
  }, [selectedGenerationDate, billType]);

  const handleGeneratePdfClick = async () => {
    try {
      const response = await axios.get("http://localhost:3000/generateMeterReport", {
        params: {
          readingType: billType,
          generationDate: selectedGenerationDate,
        },
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ width: "100%", marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h5">Meter Readings</Typography>
            <FormControl fullWidth>
              <InputLabel id="generation-date-label">Generation Date</InputLabel>
              <Select labelId="generation-date-label" value={selectedGenerationDate} label="Generation Date" onChange={handleGenerationDateChange}>
                {generationDates.map((date, index) => (
                  <MenuItem key={index} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="bill-type-label">Reading Type</InputLabel>
              <Select labelId="bill-type-label" value={billType} label="Bill Type" onChange={handleBillTypeChange}>
                <MenuItem value={"electricity"}>Electricity Reading</MenuItem>
                <MenuItem value={"water"}>Water Reading</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
        <Button variant="contained" color="primary" onClick={handleGeneratePdfClick}>
          Generate PDF
        </Button>
      </LocalizationProvider>
      <Box sx={{ display: "flex", justifyContent: "center", p: 1, m: 1, flexWrap: "wrap" }}>
        {Object.entries(meterData).map(([floor, rooms], index) => (
          <Card sx={{ width: "48%", margin: "0 20px 20px 0", "&:nth-of-type(2n)": { marginRight: 0 } }} key={index}>
            <CardContent>
              <Typography variant="h5">{`${floor} Floor`}</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 440, overflow: "auto", marginBottom: "20px" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Room</TableCell>
                      <TableCell align="right">Previous Measure</TableCell>
                      <TableCell align="right">Current Measure</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rooms.map((roomData, roomIndex) => (
                      <TableRow key={roomIndex}>
                        <TableCell component="th" scope="row">
                          {roomData.room}
                        </TableCell>
                        <TableCell align="right">{roomData.previousMeasure}</TableCell>
                        <TableCell align="right">{roomData.currentMeasure}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}
