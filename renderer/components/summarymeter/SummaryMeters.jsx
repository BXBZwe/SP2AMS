import React, { useState, useEffect } from "react";
import { Grid, Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Select, MenuItem, FormControl, InputLabel, Button, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";

export default function SummaryMeter() {
  const [billType, setBillType] = useState("electricity");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");
  const [meterData, setMeterData] = useState({});

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

  const fetchReadings = async () => {
    if (selectedGenerationDate) {
      const formattedDate = dayjs(selectedGenerationDate).format("YYYY-MM-DD");
      const readings = await Promise.all(
        selectedRooms.map(async (room) => {
          const previousReading = await getPreviousMeterReading(room.room_id, formattedDate);

          if (!previousReading) {
            return {
              room_id: room.room_id,
              room_number: room.room_number,
              floor: `Floor ${room.floor}`,
              previousReading: 0,
              currentReading: null,
            };
          }

          return {
            room_id: room.room_id,
            room_number: room.room_number,
            floor: `Floor ${room.floor}`,
            previousReading: previousReading[`${billType}_reading`],
            currentReading: null,
          };
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
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h4">Meter Readings</Typography>
                <Typography>Generate Water Meter and Electricity Meter for each floor and rooms</Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item style={{ width: "160px" }}>
                    <DatePicker
                      label="Generation Date"
                      value={selectedGenerationDate}
                      onChange={(newValue) => {
                        setSelectedGenerationDate(newValue ? newValue.toISOString() : null);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item style={{ width: "170px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="bill-type-label">Reading Type</InputLabel>
                      <Select labelId="bill-type-label" value={billType} label="Bill Type" onChange={handleBillTypeChange}>
                        <MenuItem value={"electricity"}>Electricity Reading</MenuItem>
                        <MenuItem value={"water"}>Water Reading</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleGeneratePdfClick} sx={{ marginTop: 1 }}>
              Generate PDF
            </Button>
          </CardContent>
        </Card>
      </LocalizationProvider>
      <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1, m: 1, flexWrap: "wrap" }}>
        {Object.entries(meterData).map(([floor, rooms], index) => (
          <Card sx={{ width: "calc(50% - 10px)", margin: "0 20px 20px 0", "&:nth-of-type(2n)": { marginRight: 0 } }} key={index}>
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
