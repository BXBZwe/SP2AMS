import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Select, MenuItem, TextField, Button,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";


export default function BillingDetails() {
  const types = [
    {
      id: "1",
      value: "Water Reading",
    },
    { id: "2", value: "Meter Reading" },
  ];
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false); // New state for the second dialog

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedType, setSelectedType] = useState(types[0].value);
  const [unitsDifference, setUnitsDifference] = useState({});
  const [costs, setCosts] = useState({});
  const [readingValues, setReadingValues] = useState({});
  const [previousReadings, setPreviousReadings] = useState({});
  const [waterCost, setWaterCost] = useState({});
  const [electricityCost, setElectricityCost] = useState({});

  const getroomsforbilling = async () => {
    try {
      const response = await axios.get("http://localhost:3000/generatebill");
      const billedrooms = response.data.billRecords;
      console.log("the rooms for generating bills:", billedrooms);

      const latestBilledRooms = billedrooms.reduce((acc, room) => {
        const existing = acc.find((r) => r.room_id === room.room_id);
        if (!existing || new Date(room.generation_date) > new Date(existing.generation_date)) {
          acc = acc.filter((r) => r.room_id !== room.room_id);
          acc.push(room);
        }
        return acc;
      }, []);

      setSelectedRooms(
        latestBilledRooms.map((room) => ({
          ...room,
          generation_date: new Date(room.generation_date).toISOString().split("T")[0],
        }))
      );
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };
  const checkAllFieldsFilledAndPositive = () => {
    for (const roomId of selectedRooms.map(room => room.RoomBaseDetails.room_id)) {
      const value = readingValues[roomId];
      if (value === undefined || value === '' || Number(value) < 0) {
        // Either a field is missing, empty, or contains a negative number
        return false;
      }
    }
    return true; // All fields are filled and contain non-negative numbers
  };
  const checkAllFieldsFilled = () => {
    // This function checks if all text fields have been filled
    for (const roomId of selectedRooms.map(room => room.RoomBaseDetails.room_id)) {
      if (!readingValues[roomId]) {
        return false; // A field is missing
      }
    }
    return true; // All fields are filled
  };
  
  const getPreviousMeterReading = async (roomId, generationDate) => {
    try {
      const response = await axios.get(`http://localhost:3000/getLastReadingBeforeDate/${roomId}`, {
        params: { generation_date: generationDate },
      });

      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        return { water_reading: 0, electricity_reading: 0 };
      }
    } catch (error) {
      console.error("Error fetching previous meter reading for room:", roomId, error);
      return { water_reading: 0, electricity_reading: 0 };
    }
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const fetchPreviousReadings = async () => {
    const promises = selectedRooms.map(async (room) => {
      const prevReading = await getPreviousMeterReading(room.RoomBaseDetails.room_id, room.generation_date);
      return { roomId: room.RoomBaseDetails.room_id, prevReading };
    });

    const results = await Promise.all(promises);
    const newPreviousReadings = results.reduce((acc, { roomId, prevReading }) => {
      acc[roomId] = prevReading;
      return acc;
    }, {});
    console.log("New Previous Readings", newPreviousReadings);

    setPreviousReadings(newPreviousReadings);
  };

  useEffect(() => {
    getroomsforbilling();
  }, []);

  useEffect(() => {
    if (selectedRooms.length > 0) {
      fetchPreviousReadings();
    }
  }, [selectedRooms, selectedType]);
  
  const handleReadingValueChange = (roomId, value) => {
    setReadingValues((prevValues) => ({
      ...prevValues,
      [roomId]: value,
    }));
  };
  const handleOpenDialog = () => {
    if (!checkAllFieldsFilledAndPositive()) {
      setSnackbarMessage("Please fill in all the readings with non-negative values before saving.");
      setSnackbarOpen(true);
    } else {
      // All fields are filled and non-negative, open the confirmation dialog
      setDialogOpen(true);
    }
  };
  const saveReadings = async () => {
    setDialogOpen(false);
    const readingPromises = selectedRooms.map(async (room) => {
      const roomId = room.RoomBaseDetails.room_id;
      const readingValue = readingValues[roomId];

      if (!checkAllFieldsFilled()) {
        setSnackbarMessage("Please fill in all the readings before saving.");
        setSnackbarOpen(true);
        return;
      }
      if (!checkAllFieldsFilledAndPositive()) {
        setSnackbarMessage("Please fill in all the readings with non-negative values before saving.");
        setSnackbarOpen(true);
        return;
      }

      const payload = {
        room_id: roomId,
        reading_date: room.generation_date,
        [selectedType.toLowerCase().replace(" ", "_")]: readingValue,
      };

      console.log(`Reading value in save reading function: ${readingValue}`);
      console.log(`Payload in save reading function:`, payload);

      try {
        await axios.post("http://localhost:3000/addreading", payload);
      } catch (error) {
        console.error(`Failed to save reading for room ${roomId}:`, error);
      }
    });

    await Promise.all(readingPromises);
  };
  const handleOpenGenerateDialog = () => {
    if (!checkAllFieldsFilledAndPositive()) {
      setSnackbarMessage("Please fill in all the readings with non-negative values before generating bills.");
      setSnackbarOpen(true);
    } else {
      setGenerateDialogOpen(true); // Open the generate bills confirmation dialog
    }
  };

  // Function to close the "Generate All Bills" dialog
  const handleCloseGenerateDialog = () => {
    setGenerateDialogOpen(false);
  };
  const handleGeneratebilling = async () => {
    setGenerateDialogOpen(false);
    if (!checkAllFieldsFilled()) {
      setSnackbarMessage("Please fill in all the readings before generating bills.");
      setSnackbarOpen(true);
      return;
    }
    if (!checkAllFieldsFilledAndPositive()) {
      setSnackbarMessage("Please fill in all the readings with non-negative values before generating bills.");
      setSnackbarOpen(true);
      return;
    }
    const billPromises = selectedRooms.map(async (room) => {
      try {
        const roomId = room.RoomBaseDetails.room_id;
        const payload = {
          room_id: roomId,
          // Include both meter and water readings in the payload
          // For simplicity, assuming readingValues holds values for both types
          // You might need to adjust this based on how you're storing meter and water readings
          electricity_reading: readingValues[roomId].electricity || 0, // Adjust this based on your actual data structure
          water_reading: readingValues[roomId].water || 0, // Adjust this based on your actual data structure
        };
        const response = await axios.post("http://localhost:3000/calculateandgeneratebill", { room_id: roomId });
        setWaterCost((prev) => ({
          ...prev,
          [roomId]: response.data.waterCost,
        }));
        setElectricityCost((prev) => ({
          ...prev,
          [roomId]: response.data.electricityCost,
        }));
        setCosts((prev) => ({
          ...prev,
          [roomId]: {
            waterCost: response.data.waterCost,
            electricityCost: response.data.electricityCost,
          },
        }));
        console.log(`Bill generated for Room ID ${roomId}`, response.data);
      } catch (error) {
        console.error(`Failed to generate bill for room`, error);
      }
    });
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <Card sx={{ width: "100%", display: "flex", marginBottom: "10px" }}>
          <CardContent
            sx={{
              marginRight: "auto",
              marginBottom: "10px",
            }}
          >
            <Typography variant="h4">Billing Details</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, marginBottom: 1 }}>
              Enter billing details for specific rooms
            </Typography>
            <Button variant="contained" color="primary"  onClick={handleOpenDialog}>
              Save All {selectedType}
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenGenerateDialog} sx={{ ml: 2 }}>
              Generate All Bills
            </Button>

          </CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "15px",
              width: "20%",
            }}
          >
            <Select label="Reading Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} variant="outlined" sx={{ width: "100%" }}>
              {types.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <Card
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {selectedRooms.map((room) => {
              const previousReading = previousReadings[room.RoomBaseDetails.room_id];
              return (
                <Box key={`${room.RoomBaseDetails.room_id}-${room.generation_date}`} sx={{ margin: "10px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ marginBottom: "10px" }} variant="h6">
                      Room {room.RoomBaseDetails.room_number} - {selectedType}
                    </Typography>
                    <MoreVertIcon />
                  </Box>

                  {selectedType === "Meter Reading" && (
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <TextField type="number" variant="outlined" sx={{ width: "25%" }} label={`Previous ${selectedType}`} value={previousReading?.electricity_reading || "N/A"} disabled />
                      <TextField label={`Current ${selectedType}`} type="number" variant="outlined" sx={{ width: "25%" }} value={readingValues[room.RoomBaseDetails.room_id] || ""} onChange={(e) => handleReadingValueChange(room.RoomBaseDetails.room_id, e.target.value)} />
                      <TextField label="Units Difference" type="number" variant="outlined" sx={{ width: "25%" }} value={unitsDifference[room.RoomBaseDetails.room_id] || "N/A"} disabled />
                      <TextField label="Cost" type="number" variant="outlined" sx={{ width: "25%" }} value={costs[room.id] || 0} disabled />
                    </Box>
                  )}
                  {selectedType === "Water Reading" && (
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <TextField label={`Previous ${selectedType}`} type="number" variant="outlined" sx={{ width: "25%" }} value={previousReading?.water_reading || "N/A"} disabled />
                      <TextField label={`Current ${selectedType}`} type="number" variant="outlined" sx={{ width: "25%" }} value={readingValues[room.RoomBaseDetails.room_id] || ""} onChange={(e) => handleReadingValueChange(room.RoomBaseDetails.room_id, e.target.value)} />
                      <TextField label="Units Difference" type="number" variant="outlined" sx={{ width: "25%" }} value={unitsDifference[room.RoomBaseDetails.room_id] || "N/A"} disabled />
                      <TextField label="Cost" type="number" variant="outlined" sx={{ width: "25%" }} value={costs[room.id] || 0} disabled />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Card>
        </Box>
        <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Save"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to save all readings?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained"  onClick={saveReadings} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={generateDialogOpen}
        onClose={handleCloseGenerateDialog}
        aria-labelledby="generate-dialog-title"
        aria-describedby="generate-dialog-description"
      >
        <DialogTitle id="generate-dialog-title">{"Confirm Bill Generation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="generate-dialog-description">
            Are you sure you want to generate bills for all readings?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseGenerateDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleGeneratebilling} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position Snackbar at the top-right corner
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
