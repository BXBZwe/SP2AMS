import { React, useState } from "react";
import {Box, Typography, Card, CardContent, CardActions,
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

export default function CheckIn() {

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [contractMonths, setContractMonths] = useState("");
  const [deposit, setDeposit] = useState("");
  const [moveInDate, setMoveInDate] = useState(null);
  const [moveOutDate, setMoveOutDate] = useState(null);
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
    setDeposit("");
    setMoveInDate(null);
    setMoveOutDate(null);
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

    // Validate MoveIn and MoveOut
    const isMoveInValid = moveInDate !== null;
    const isMoveOutValid = moveOutDate !== null && moveOutDate > moveInDate;

    // If any validation fails, highlight the corresponding text field
    if (
      !isContractMonthsValid ||
      !isDepositValid ||
      !isMoveInValid ||
      !isMoveOutValid
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

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card sx={{ width: "100%", display: "flex", marginBottom: "10px" }}>
              <CardContent
                sx={{
                  marginRight: "auto",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h4">Check-In</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Add New Tenants to the rooms they rent
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box>
                <Card sx={{ width: "55vw", marginBottom: "10px" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                      Select Room/Tenant
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
                        {rooms.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        id="tenantId"
                        select
                        label="Tenant Name"
                        value={selectedTenant}
                        onChange={(e) => setSelectedTenant(e.target.value)}
                        sx={{ width: "40vw" }}
                        error={
                          addButtonClicked &&
                          (!selectedTenant || selectedTenant === "")
                        }
                        helperText={
                          addButtonClicked &&
                            (!selectedTenant || selectedTenant === "")
                            ? "The field cannot be empty."
                            : ""
                        }
                      >
                        {tenants.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ width: "55vw" }}>
                  <CardContent>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                        Input Contract Details
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <DatePicker
                        id="moveindateId"
                        label="Move In"
                        value={moveInDate}
                        onChange={handleMoveInDateChange}
                        sx={{ width: "40vw" }}
                        error={
                          addButtonClicked && (!moveInDate || moveInDate === "")
                        }
                        helperText={
                          addButtonClicked && (!moveInDate || moveInDate === "")
                            ? "The field cannot be empty."
                            : ""
                        }
                      />

                      <Typography variant="h6" sx={{ margin: "0 10px" }}>
                        -
                      </Typography>

                      <DatePicker
                        id="moveoutdateId"
                        label="Move Out"
                        value={moveOutDate}
                        minDate={moveInDate} // Set minimum date for move-out
                        onChange={handleMoveOutDateChange}
                        sx={{ width: "40vw" }}
                        error={
                          addButtonClicked &&
                          (!moveOutDate || moveOutDate === "")
                        }
                        helperText={
                          addButtonClicked &&
                            (!moveOutDate || moveOutDate === "")
                            ? "The field cannot be empty."
                            : ""
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: "30px",
                      }}
                    >
                      <TextField
                        id="contractMonths"
                        label="Contract Months"
                        sx={{ width: "40vw" }}
                        value={contractMonths}
                        type="number"
                        error={
                          addButtonClicked &&
                          (!validateFloat(contractMonths) ||
                            contractMonths <= 0)
                        }
                        helperText={
                          addButtonClicked &&
                            (!validateFloat(contractMonths) ||
                              contractMonths <= 0)
                            ? "Contract months must be a positive number."
                            : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">M</InputAdornment>
                          ),
                        }}
                        onChange={(e) => setContractMonths(e.target.value)}
                      />

                      <TextField
                        id="deposit"
                        label="Deposit"
                        sx={{ width: "40vw" }}
                        value={deposit}
                        type="number"
                        error={
                          addButtonClicked &&
                          (!validateFloat(deposit) || deposit <= 0)
                        }
                        helperText={
                          addButtonClicked &&
                            (!validateFloat(deposit) || deposit <= 0)
                            ? "Deposit must be a positive number."
                            : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">THB</InputAdornment>
                          ),
                        }}
                        onChange={(e) => setDeposit(e.target.value)}
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
