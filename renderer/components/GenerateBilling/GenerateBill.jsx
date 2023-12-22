import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Checkbox,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  MobileDatePicker,
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function GenerateBill() {
  const roomDetails = [
    {
      roomId: "R001",
      room: "101",
    },
    {
      roomId: "R002",
      room: "102",
    },
    {
      roomId: "R003",
      room: "203",
    },
    {
      roomId: "R004",
      room: "204",
    },
    {
      roomId: "R005",
      room: "301",
    },
    {
      roomId: "R006",
      room: "302",
    },
    {
      roomId: "R007",
      room: "203",
    },
    {
      roomId: "R008",
      room: "301",
    },
  ];
  const months = [
    {
      id: "M1",
      label: "January",
    },
    {
      id: "M2",
      label: "February",
    },
    {
      id: "M3",
      label: "March",
    },
    {
      id: "M4",
      label: "April",
    },
    {
      id: "M5",
      label: "May",
    },
    {
      id: "M6",
      label: "June",
    },
    {
      id: "M7",
      label: "July",
    },
    {
      id: "M8",
      label: "August",
    },
    {
      id: "M9",
      label: "September",
    },
    {
      id: "M10",
      label: "October",
    },
    {
      id: "M11",
      label: "November",
    },
    {
      id: "M12",
      label: "December",
    },
  ];

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [year, setYear] = useState("");

  const [selectedRoomList, setSelectedRoomList] = useState([]);
  const [addAllChecked, setAddAllChecked] = useState(false);
  const [moveInDate, setMoveInDate] = useState(null);
  const [generateButtonClicked, setGenerateButtonClicked] = useState(false);

  const handleMoveInDateChange = (date) => {
    setMoveInDate(date);
  };

  const handleAddButtonClick = () => {
    if (selectedRoom) {
      setSelectedRoomList((prevList) => [...prevList, selectedRoom]);
      setSelectedRoom("");
    }
  };

  const handleClearAllClick = () => {
    setSelectedRoomList([]);
    setAddAllChecked(false);
  };

  const handleAddAllClick = () => {
    const allRoomNumbers = roomDetails.map((option) => option.room);
    setSelectedRoomList(allRoomNumbers);
    setAddAllChecked(true);
  };

  const handleRemoveRoom = (roomToRemove) => {
    setSelectedRoomList((prevList) =>
      prevList.filter((room) => room !== roomToRemove)
    );
    setAddAllChecked(false);
  };

  useEffect(() => {
    // console.log("Selected Room List:", selectedRoomList);
  }, [selectedRoomList]);


  const handleGenerateButtonClick = () => {
    // Set button clicked state to true
    setGenerateButtonClicked(true);

    // Validate Year
    const isYearValid = validateInt(year) && year > 0;

    // Validate MoveIn and MoveOut
    const isMoveInValid = moveInDate !== null;


    // If any validation fails, highlight the corresponding text field
    if (!isYearValid || !isMoveInValid) {
      return;
    }

    // If all validations pass, you can proceed with adding the data
    // Add your logic here
  };

  const validateInt = (value) => {
    const floatValue = parseInt(value);
    return !isNaN(floatValue);
  };

  const resetForm = () => {
    setSelectedMonth("");
    setYear("");
    setMoveInDate(null);
    setGenerateButtonClicked(false); // Reset button state
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
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
                <Typography variant="h4">Generate Billing</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Generate billing for all or specific rooms
                </Typography>
              </CardContent>
            </Card>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                // marginTop: "10px",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <Box>
                <Card sx={{ width: "50vw" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                      Select Rooms
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: "30px",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="roomId"
                        select
                        label="Room Number"
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        sx={{ width: "40vw" }}
                      >
                        {roomDetails.map((option) => (
                          <MenuItem key={option.roomId} value={option.room}>
                            {option.room}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ width: "10vw" }}
                        onClick={handleAddButtonClick}
                      >
                        Add
                      </Button>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          onClick={handleAddAllClick}
                          checked={addAllChecked}
                        />
                        <Typography variant="body2">All Rooms</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                {selectedRoomList.length > 0 && (
                  <Card sx={{ marginTop: "10px", width: "50vw" }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6">
                          Rooms selected for invoice generation
                        </Typography>
                        <IconButton
                          variant="contained"
                          size="medium"
                          onClick={handleClearAllClick}
                        >
                          <DeleteForeverRoundedIcon />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {selectedRoomList.map((room, index) => (
                          <Box
                            key={index}
                            sx={{
                              borderRadius: "2px",
                              border: "1px solid #ccc",
                              padding: "8px",
                              marginBottom: "8px",
                              marginRight: "8px",
                              display: "flex",
                              width: "10vw",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography sx={{ marginRight: "8px" }}>
                              {room}
                            </Typography>
                            <IconButton onClick={() => handleRemoveRoom(room)}>
                              <ClearIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Card
                  sx={{

                    padding: "10px",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    Invoice Data
                  </Typography>
                  <DatePicker
                    id="moveindateId"
                    label="Move In"
                    value={moveInDate}
                    onChange={handleMoveInDateChange}
                    sx={{ width: "100%", marginBottom: "10px" }}
                      error={generateButtonClicked && (!moveInDate || moveInDate === "")}
                      helperText={
                        generateButtonClicked && (!moveInDate || moveInDate === "")
                          ? "Empty Field!"
                          : ""
                      }
                  />
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <TextField
                      id="monthId"
                      select
                      label="Select Month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      sx={{ width: "50%", marginBottom: "10px" }}
                      error={
                        generateButtonClicked &&
                        (!selectedMonth || selectedMonth === "")
                      }
                      helperText={
                        generateButtonClicked &&
                        (!selectedMonth || selectedMonth === "")
                          ? "Empty Field!"
                          : ""
                      }
                    >
                      {months.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      id="yearId"
                      label="Enter Year"
                      sx={{ width: "50%" }}
                      error={
                        generateButtonClicked &&
                        (!year || year === "")
                      }
                      helperText={
                        generateButtonClicked &&
                        (!year || year === "")
                          ? "Empty Field!"
                          : ""
                      }
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                  >
                    <Button sx={{ width: "20%" }} variant="outlined" onClick={resetForm}>
                      Clear
                    </Button>
                    <Button
                      sx={{ width: "80%" }}
                      variant="contained"
                      onClick={handleGenerateButtonClick}
                    >
                      Generate
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Box>
          </Box>
        </div>
      </LocalizationProvider>
    </>
  );
}
