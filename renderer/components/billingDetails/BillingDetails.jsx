// New One
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import { styled } from '@mui/material/styles';
import  { linearProgressClasses } from '@mui/material/LinearProgress';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import the check circle icon
require('dotenv').config();

export default function BillingDetails() {

// const rolloverWater = parseInt(process.env.ROLLOVER_WATER, 10);
// const rolloverElectricity = parseInt(process.env.ROLLOVER_ELECTRICITY, 10);
// console.log('RollOverWater',rolloverWater)

  // const router = useRouter();
  // const [openNavDialog, setOpenNavDialog] = useState(false); // State to control the dialog visibility
  // const [leaveUrl, setLeaveUrl] = useState(''); // Assuming you have a saveProgress state

  // // Function to handle "Stay on page" action
  // const handleStay = () => {
  //   setOpenNavDialog(false); // Close the dialog
  // };

  // // Function to handle "Leave page" action
  // const handleLeave = (url) => {
  //   console.log("State Leave Url", leaveUrl);
  //   setOpenNavDialog(false); // Close the dialog
  //   router.push(leaveUrl).catch(() => {}); 
  // };

  // const handleNavigation = (link) => {
  //   // If the saveProgress is not 100%, prompt the user before navigating away
  //   const currentPath = router.pathname;
  //   if (saveProgress < 100) {
  //     setOpenNavDialog(true); // Open the navigation warning dialog
  
  //     // Set the URL they're trying to navigate to, so you can use it if they confirm
  //     setLeaveUrl(link); 
  //   } 
  //   else {
  //     // If there's no unsaved progress, navigate directly
  //     router.push(link);
  //   }
  // };
  

  // useEffect(() => {
  //   // Listen for route changes before they happen
  //   router.events.on('routeChangeStart', handleNavigation);
  //   // console.log('routeChangeStart',router.events);

  //   return () => {
  //     router.events.off('routeChangeStart', handleNavigation);
  //   };
  // }, [saveProgress, router.events]);
  
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
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedType, setSelectedType] = useState(types[0].value);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState(null);
  const [allGenerationDate, setAllGenerationDate] = useState([]);
  const [unitsDifference, setUnitsDifference] = useState({});
  const [costs, setCosts] = useState({});
  const [readingValues, setReadingValues] = useState({});
  const [previousReadings, setPreviousReadings] = useState({});
  const [waterCost, setWaterCost] = useState({});
  const [electricityCost, setElectricityCost] = useState({});
  const [snackbarSeverity, setSnackbarSeverity] = useState("error"); // Default to 'error'
  const [billedRooms, setBilledRooms] = useState([]);
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveCallCount, setSaveCallCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);


  const getroomsforbilling = async () => {
    try {
      const response = await axios.get("http://localhost:3000/generatebill");
      const billedrooms = response.data.billRecords;

      const allDates = billedrooms.map(
        (item) => new Date(item.generation_date).toISOString().split("T")[0]
      );

      const uniqueDates = [...new Set(allDates)];
      const sortedDates = uniqueDates.sort((a, b) => new Date(b) - new Date(a));
      const latestDate = sortedDates[0];
      setAllGenerationDate(sortedDates); // Use sortedDates here to ensure the dates are sorted
      setSelectedGenerationDate(latestDate);
      setBilledRooms(billedrooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const checkAllFieldsFilledAndPositive = () => {
    for (const roomId of selectedRooms.map(
      (room) => room.RoomBaseDetails.room_id
    )) {
      const value = readingValues[roomId];
      if (value === undefined || value === "" || Number(value) < 0) {
        return false;
      }
    }
    return true;
  };
  const checkAllFieldsFilled = () => {
    for (const roomId of selectedRooms.map(
      (room) => room.RoomBaseDetails.room_id
    )) {
      if (!readingValues[roomId]) {
        return false;
      }
    }
    return true;
  };

  const getPreviousMeterReading = async (roomId, generationDate) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getLastReadingBeforeDate/${roomId}`,
        {
          params: { generation_date: generationDate },
        }
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        return { water_reading: 0, electricity_reading: 0 };
      }
    } catch (error) {
      console.error(
        "Error fetching previous meter reading for room:",
        roomId,
        error
      );
      return { water_reading: 0, electricity_reading: 0 };
    }
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const fetchPreviousReadings = async () => {
    const promises = selectedRooms.map(async (room) => {
      const prevReading = await getPreviousMeterReading(
        room.RoomBaseDetails.room_id,
        selectedGenerationDate
      );

      return { roomId: room.RoomBaseDetails.room_id, prevReading };
    });

    const results = await Promise.all(promises);
    const newPreviousReadings = results.reduce(
      (acc, { roomId, prevReading }) => {
        acc[roomId] = prevReading;
        return acc;
      },
      {}
    );

    setPreviousReadings(newPreviousReadings);
  };

  const calculateUnitsDifference = () => {
    const newUnitsDifference = {};
  
    selectedRooms.forEach((room) => {     
      const roomId = room.RoomBaseDetails.room_id;
      const currentReadingInput = readingValues[roomId]; 
  
      // Only proceed if there's an input for the current reading
      if (currentReadingInput !== undefined && currentReadingInput !== "") {
        const currentReading = parseFloat(currentReadingInput); 
  
        let previousReading = 0;
        let rolloverValue = 0;
        if (selectedType === "Water Reading") {
          previousReading = previousReadings[roomId]?.water_reading || 0;
          rolloverValue = 10000; 
        } else if (selectedType === "Meter Reading") {
          previousReading = previousReadings[roomId]?.electricity_reading || 0;
          rolloverValue = 1000000; 
        }
  
        // Adjust current reading if it's less than previous (accounting for rollover)
        let adjustedCurrentReading = currentReading;
        if (currentReading < previousReading) {
          adjustedCurrentReading += rolloverValue;
        }
  
        // Calculate the difference with adjusted current reading
        const difference = adjustedCurrentReading - previousReading;
  
        newUnitsDifference[roomId] = difference; // Set the calculated difference
      } else {
        // If there's no input, set the units difference to a placeholder or null
        newUnitsDifference[roomId] = null; // Or use "-" or another placeholder
      }
    });
  
    setUnitsDifference(newUnitsDifference);
  };
  
  

  useEffect(() => {
    calculateUnitsDifference();
    console.log('readingvalues',readingValues);
  }, [readingValues, previousReadings]);

  useEffect(() => {
    // Reset the current readings when the selected type changes
    const resetReadingValues = {};
    selectedRooms.forEach((room) => {
      resetReadingValues[room.RoomBaseDetails.room_id] = ""; // Set empty string for each room's current reading
    });
    setReadingValues(resetReadingValues);
  }, [selectedType, selectedRooms]);

  useEffect(() => {
    if (selectedRooms.length > 0 && selectedGenerationDate) {
      fetchPreviousReadings();
    }
  }, [selectedRooms, selectedGenerationDate]); // Add selectedGenerationDate as a dependency

  useEffect(() => {
    getroomsforbilling();
  }, []);

  useEffect(() => {
    if (selectedGenerationDate && billedRooms.length > 0) {
      const roomsForSelectedDate = billedRooms.filter((room) => {
        const roomDate = new Date(room.generation_date)
          .toISOString()
          .split("T")[0];
        return roomDate === selectedGenerationDate;
      });

      setSelectedRooms(roomsForSelectedDate);
    }
  }, [selectedGenerationDate, billedRooms]);

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
      setSnackbarMessage(
        "Please fill in all the readings with non-negative values before saving."
      );
      setSnackbarOpen(true);
    } else {
      // All fields are filled and non-negative, open the confirmation dialog
      setDialogOpen(true);
    }
  };

  const saveReadings = async () => {
    setIsSaving(true);
    let localSavedCount = 0;
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
        setSnackbarMessage(
          "Please fill in all the readings with non-negative values before saving."
        );
        setSnackbarOpen(true);
        return;
      }

      const payload = {
        room_id: roomId,
        reading_date: selectedGenerationDate,
        [selectedType.toLowerCase().replace(" ", "_")]: readingValue,
      };

      try {
        await axios.post("http://localhost:3000/addreading", payload);
        localSavedCount++;
      } catch (error) {
        console.error(`Failed to save reading for room ${roomId}:`, error);
      }
    });

    await Promise.all(readingPromises);

    if (localSavedCount > 0) {
      setSaveCallCount((prevCount) => prevCount + 1);
      setSaveProgress((saveCallCount + 1) * 33.5);

      if (saveCallCount + 1 === 2) {
        setSnackbarMessage("All readings have been saved successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    }
    setIsSaving(false);
  };
  const handleOpenGenerateDialog = () => {
    if (!checkAllFieldsFilledAndPositive()) {
      setSnackbarMessage(
        "Please fill in all the readings with non-negative values before generating bills."
      );
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
      setSnackbarMessage(
        "Please fill in all the readings with non-negative values before generating bills."
      );
      setSnackbarSeverity("error"); // Set snackbar to show error
      setSnackbarOpen(true);
      return;
    }
    if (!checkAllFieldsFilledAndPositive()) {
      setSnackbarMessage(
        "Please fill in all the readings with non-negative values before generating bills."
      );
      setSnackbarSeverity("error"); // Set snackbar to show error
      setSnackbarOpen(true);
      return;
    }
    const billPromises = selectedRooms.map(async (room) => {
      try {
        const roomId = room.RoomBaseDetails.room_id;
        const payload = {
          room_id: roomId,
          electricity_reading: readingValues[roomId].electricity || 0, // Adjust this based on your actual data structure
          water_reading: readingValues[roomId].water || 0, // Adjust this based on your actual data structure
        };
        const response = await axios.post(
          "http://localhost:3000/calculateandgeneratebill",
          { room_id: roomId }
        );
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
        // console.log(`Bill generated for Room ID ${roomId}`, response.data);
        setSaveProgress(((saveCallCount + 1) /3) * 100);
        setSnackbarSeverity("success");
        setSnackbarMessage("All bills have been successfully generated.");
        setSnackbarOpen(true); // This is crucial
      } catch (error) {
        setSnackbarMessage("Failed to generate bills.");
        setSnackbarSeverity("error"); // Keep snackbar on error for actual errors
        setSnackbarOpen(true);
        console.error(`Failed to generate bill for room`, error);
      }
    });
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };



  // Custom styled LinearProgress
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10, // Increase the height of the progress bar here
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        {/* Use BorderLinearProgress instead of the default LinearProgress */}
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

  // console.log('Selected Room',selectedRooms);
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

            <Box>
  {saveProgress >= 100 ? (
    <Button variant="contained" color="primary" disabled>
      All Steps Completed
    </Button>
  ) : saveCallCount === 2 ? (
    <Button variant="contained" color="primary" onClick={handleOpenGenerateDialog}>
      Generate All Bills
    </Button>
  ) : (
    <Button variant="contained" color="primary" onClick={handleOpenDialog}>
      Save {selectedType}
    </Button>
  )}
</Box>
          </CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              flexDirection: "row",
              marginRight: "15px",
              width: "40%",
            }}
          >
            <Box sx={{ paddingRight: "10px" }}>
              <Select
                label="Generation Date"
                value={selectedGenerationDate || ""}
                onChange={(e) => setSelectedGenerationDate(e.target.value)}
                variant="outlined"
                displayEmpty
                sx={{ width: "100%", paddingRight: "10px" }}
              >
                {allGenerationDate.map((date, index) => (
                  <MenuItem key={index} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Reading Type</InputLabel>
              <Select
                label="Reading Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                variant="outlined"
                // sx={{ width: "100%" }}
              >
                {types.map((item) => (
                  <MenuItem key={item.id} value={item.value}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            </Box>
          </Box>
        </Card>
        {/*Progress Bar*/}
        <Box sx={{ width: "100%", mb: 2 }}>
          {isSaving ? (
            <CircularProgress />
          ) : (
            <LinearProgressWithLabel value={saveProgress} />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "left",
              gap: "5px",
              width: "100%",
            }}
          >
            {selectedRooms.map((room) => {
              const previousReading =
                previousReadings[room.RoomBaseDetails.room_id];
              return (
                <Card
                  key={`${room.RoomBaseDetails.room_id}-${room.generation_date}`}
                  sx={{
                    flexGrow: 1,
                    flexBasis: "calc(33.333% - 5px)",
                    maxWidth: "calc(33.333% - 5px)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px",
                    minWidth: 350,
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ marginBottom: "10px" }} variant="body1">
                      Room {room.RoomBaseDetails.room_number} - {selectedType}
                    </Typography>
                  </Box>

                  {selectedType === "Meter Reading" && (
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <TextField
                        type="number"
                        variant="outlined"
                        sx={{ width: "33%" }}
                        label={`Previous`}
                        value={previousReading?.electricity_reading || "N/A"}
                        disabled
                      />
                      <TextField
                        label={`Current`}
                        type="number"
                        variant="outlined"
                        sx={{ width: "33%" }}
                        value={
                          readingValues[room.RoomBaseDetails.room_id] || ""
                        }
                        onChange={(e) =>
                          handleReadingValueChange(
                            room.RoomBaseDetails.room_id,
                            e.target.value
                          )
                        }
                      />

                      <TextField
                        label="Units"
                        type="number"
                        variant="outlined"
                        sx={{ width: "33%" }}
                        value={
                          unitsDifference[room.RoomBaseDetails.room_id] || "N/A"
                        }
                        disabled
                      />
                    </Box>
                  )}
                  {selectedType === "Water Reading" && (
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <TextField
                        label={`Previous`}
                        type="number"
                        variant="outlined"
                        sx={{ width: "33%" }}
                        value={previousReading?.water_reading || "N/A"}
                        disabled
                      />
                      <TextField
                        label={`Current`}
                        type="number"
                        variant="outlined"
                        sx={{ width: "33%" }}
                        value={
                          readingValues[room.RoomBaseDetails.room_id] || ""
                        }
                        onChange={(e) =>
                          handleReadingValueChange(
                            room.RoomBaseDetails.room_id,
                            e.target.value
                          )
                        }
                      />

                      <TextField
                        label="Units"
                        type="number"
                        variant="outlined"
                        sx={{ width: "33%" }}
                        value={
                          unitsDifference[room.RoomBaseDetails.room_id] || "N/A"
                        }
                        disabled
                      />
                    </Box>
                  )}
                </Card>
              );
            })}
          </Box>
        </Box>
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Save"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to save all readings?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="contained" onClick={saveReadings} autoFocus>
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
          <DialogTitle id="generate-dialog-title">
            {"Confirm Bill Generation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="generate-dialog-description">
              Are you sure you want to generate bills for all readings?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseGenerateDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleGeneratebilling}
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

{/*Navigation Dialog*/}
{/* <Dialog open={openNavDialog} onClose={handleStay}>
        <DialogTitle>{"Confirm Navigation"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to leave?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStay} color="primary">
            Stay on page
          </Button>
          <Button onClick={handleLeave} color="primary" autoFocus>
            Leave page
          </Button>
        </DialogActions>
      </Dialog> */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          icon={
            snackbarSeverity === "success" ? (
              <CheckCircleIcon fontSize="inherit" />
            ) : undefined
          } // Conditionally render the check icon for success
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

