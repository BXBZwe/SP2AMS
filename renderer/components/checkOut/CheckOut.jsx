import { React, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import {
  MobileDatePicker,
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function CheckOut() {
  const rooms = [
    {
      value: "R102",
      label: "102",
    },
    {
      value: "R101",
      label: "101",
    },
  ];

  const tenants = [
    {
      value: "P1",
      label: "Yasi",
    },
    {
      value: "P2",
      label: "Saw",
    },
  ];

  const recentActivity = [
    {
      id: "R001",
      room: "101",
      date: "20 Tue 2022",
      status: "Move-In",
    },
    {
      id: "R002",
      room: "105",
      date: "20 Tue 2022",
      status: "Move-In",
    },
    {
      id: "R003",
      room: "102",
      date: "21 Wed 2022",
      status: "Move-Out",
    },
  ];

  const roomDetails = [
    {
      roomId: "R001",
      room: "101",
      moveInDate: "20/02/2022",
      moveOutDate: "20/02/2023",
      tenantId: "123",
      tenantName: "Yasi",
      depositAmount: 3000,
      monthsLeft: 6,
      dueDate: "20/02/2023",
      dayMonth: "Tuesday,March",
    },
    {
      roomId: "R002",
      room: "102",
      moveInDate: "19/01/2022",
      moveOutDate: "19/01/2023",
      tenantId: "124",
      tenantName: "Zwe",
      depositAmount: 5000,
      monthsLeft: 3,
      dueDate: "20/02/2023",
      dayMonth: "Wednesday,May",
    },
    {
      roomId: "R003",
      room: "203",
      moveInDate: "20/02/2022",
      moveOutDate: "20/02/2025",
      tenantId: "125",
      tenantName: "Saw",
      depositAmount: 2500,
      monthsLeft: 1,
      dueDate: "20/02/2023",
      dayMonth: "Friday,December",
    },
  ];

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [contractMonths, setContractMonths] = useState("");
  const [contractMonthsLeft, setContractMonthsLeft] = useState("");
  const [deposit, setDeposit] = useState("");
  const [moveInDate, setMoveInDate] = useState(null);
  const [moveOutDate, setMoveOutDate] = useState(null);
  const [tenantMoveInDate, setTenantMoveInDate] = useState("");
  const [tenantMoveOutDate, setTenantMoveOutDate] = useState("");
  const [monthsLeft, setMonthsLeft] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dayMonth, setDayMonth] = useState("");

  const [addButtonClicked, setAddButtonClicked] = useState(false);

  const handleMoveInDateChange = (date) => {
    setMoveInDate(date);
    if (moveOutDate && date > moveOutDate) {
      setMoveOutDate(date);
    }
  };

  const handleMoveOutDateChange = (date) => {
    if (moveInDate && date < moveInDate) {
      setMoveOutDate(moveInDate);
    } else {
      setMoveOutDate(date);
    }
  };

  // Clear Button Function
  const resetForm = () => {
    setSelectedRoom("");
    setSelectedTenant("");
    setContractMonths("");
    setContractMonthsLeft("");
    setDeposit("");
    setMoveInDate(null);
    setMoveOutDate(null);
    setTenantMoveInDate("");
    setTenantMoveOutDate("");
    setMonthsLeft("");
    setDueDate("");
    setDayMonth("");
    setAddButtonClicked(false); // Reset button state
  };

  // Add Button Function
  const handleAddButtonClick = () => {
    // Set button clicked state to true
    setAddButtonClicked(true);

    // Validate contractMonths and deposit
    const isContractMonthsValid =
      validateFloat(contractMonths) && contractMonths > 0;
    const isDepositValid = validateFloat(deposit) && deposit > 0;
    const isContractMonthsLeftValid =
      validateInt(contractMonthsLeft) && contractMonthsLeft >= 0;

    // Validate MoveIn and MoveOut
    const isMoveInValid = moveInDate !== null;
    const isMoveOutValid = moveOutDate !== null && moveOutDate > moveInDate;

    // If any validation fails, highlight the corresponding text field
    if (
      !isContractMonthsValid ||
      !isDepositValid ||
      !isMoveInValid ||
      !isMoveOutValid ||
      !isContractMonthsLeftValid
    ) {
      return;
    }

    // If all validations pass, you can proceed with adding the data
    // Add your logic here
  };

  const validateFloat = (value) => {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue);
  };

  const validateInt = (value) => {
    const floatValue = parseInt(value);
    return !isNaN(floatValue);
  };

  useEffect(() => {
    // Fetch and set the corresponding details when selectedRoom changes
    const selectedRoomDetails = roomDetails.find(
      (detail) => detail.room === selectedRoom
    );
    if (selectedRoomDetails) {
      setSelectedTenant(selectedRoomDetails.tenantName);
      setTenantMoveInDate(selectedRoomDetails.moveInDate);
      setTenantMoveOutDate(selectedRoomDetails.moveOutDate);
      setDeposit(selectedRoomDetails.depositAmount);
      setMonthsLeft(selectedRoomDetails.monthsLeft);
      setDueDate(selectedRoomDetails.dueDate);
      setDayMonth(selectedRoomDetails.dayMonth);
    }
  }, [selectedRoom]);

  const handleSelectedRoomChange = (e) => {
    const selectedRoomValue = e.target.value;
    setSelectedRoom(selectedRoomValue);

    // If you want to reset Move In and Move Out dates when selecting a new room
    setMoveInDate(null);
    setMoveOutDate(null);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // marginBottom: "10px",
            }}
          >
            <Card sx={{ width: "100%", display: "flex", marginBottom: "10px" }}>
              <CardContent
                sx={{
                  marginRight: "auto",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h4">Check-Out</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Select rooms and modify contract months
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box>
                <Card sx={{ width: "55vw", marginBottom: "10px" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                      Current Room Details
                    </Typography>

                    <Box sx={{ display: "flex", gap: "30px" }}>
                      <TextField
                        id="roomId"
                        select
                        label="Room Number"
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        sx={{ width: "40vw", marginBottom: "10px" }}
                        error={
                          addButtonClicked &&
                          (!selectedRoom || selectedRoom === "")
                        }
                        helperText={
                          addButtonClicked &&
                          (!selectedRoom || selectedRoom === "")
                            ? "The field cannot be empty."
                            : ""
                        }
                      >
                        {roomDetails.map((option) => (
                          <MenuItem key={option.roomId} value={option.room}>
                            {option.room}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        id="tenantId"
                        disabled
                        label="Tenant Name"
                        value={selectedTenant}
                        sx={{ width: "40vw" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="moveindateId"
                        disabled
                        label="Move In"
                        value={tenantMoveInDate}
                        sx={{ width: "40vw" }}
                      />

                      <Typography variant="h6" sx={{ margin: "0 10px" }}>
                        -
                      </Typography>

                      <TextField
                        id="moveoutdateId"
                        disabled
                        label="Move Out"
                        value={tenantMoveOutDate}
                        sx={{ width: "40vw" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <TextField
                        id="moveoutdateId"
                        disabled
                        label="Deposit"
                        value={deposit}
                        sx={{ width: "40vw" }}
                      />
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ width: "55vw" }}>
                  <CardContent>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                        Months left on Contract
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "left",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <TextField
                        id="contractMonthsLeft"
                        label="Months Left"
                        sx={{ width: "25vw" }}
                        value={monthsLeft}
                        type="number"
                        error={
                          addButtonClicked &&
                          (!validateFloat(contractMonthsLeft) ||
                            contractMonthsLeft < 0)
                        }
                        helperText={
                          addButtonClicked &&
                          (!validateFloat(contractMonthsLeft) ||
                            contractMonthsLeft < 0)
                            ? "Months must be a positive number."
                            : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              Months
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setContractMonthsLeft(e.target.value)}
                      />

                    </Box>
                  </CardContent>
                </Card>

                <Box
                  sx={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "right",
                    marginTop: "20px",
                    justifyContent: "right",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{ width: "20%" }}
                    onClick={resetForm}
                  >
                    Clear
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ width: "20%" }}
                    onClick={handleAddButtonClick}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <Card sx={{ width: "100%", marginLeft: "1vw" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    Recent Activity
                  </Typography>
                  {recentActivity.map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        gap: "5px",
                      }}
                    >
                      <Box
                        // key={activity.id}
                        sx={{
                          borderRadius: "2px",
                          border: "1px solid #ccc",
                          padding: "8px",
                          display: "flex",
                          width: "30%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ marginRight: "8px" }}>
                          {activity.room}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          borderRadius: "2px",
                          border: "1px solid #ccc",
                          padding: "8px",
                          display: "flex",
                          width: "70%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ marginRight: "8px" }}>
                          {activity.status}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </div>
      </LocalizationProvider>
    </>
  );
}
