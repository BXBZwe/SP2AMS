import { React, useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { useAPI } from "../ratemaintenance/apiContent";

export default function CheckOut() {
  const { tenancyRecords, fetchTenancyRecords, refreshTenancyRecords } =
    useAPI();
  useEffect(() => {
    fetchTenancyRecords();
  }, [fetchTenancyRecords]);

  const recentActivity = tenancyRecords
    .filter((record) => record.tenancy_status === "CHECK_OUT") // Filter for "CHECK_IN" status only
    .map((record) => ({
      id: `R${record.record_id.toString().padStart(3, "0")}`, // Assuming record_id is unique and can serve as an identifier
      room: record.RoomBaseDetails.room_number,
      date: new Date(record.move_in_date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      moveIn: new Date(record.move_in_date).toISOString().split("T")[0], // Convert to ISO string and take the date part for rendering
    }))
    .sort((a, b) => b.moveIn - a.moveIn);

  // const recentActivity = [
  //   {
  //     id: "R001",
  //     room: "101",
  //     date: "20 Tue 2022",
  //     status: "Move-In",
  //   },
  //   {
  //     id: "R002",
  //     room: "105",
  //     date: "20 Tue 2022",
  //     status: "Move-In",
  //   },
  //   {
  //     id: "R003",
  //     room: "102",
  //     date: "21 Wed 2022",
  //     status: "Move-Out",
  //   },
  // ];
  const [monthsLeft, setMonthsLeft] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dayMonth, setDayMonth] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [contractMonths, setContractMonths] = useState("");
  const [contractMonthsLeft, setContractMonthsLeft] = useState("");
  const [deposit, setDeposit] = useState("");
  const [moveInDate, setMoveInDate] = useState(null);
  const [moveOutDate, setMoveOutDate] = useState(null);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/checkouttenant",
        {
          roomNumber: selectedRoom,
          tenant_id: tenantDetails.tenant_id,
        }
      );
      refreshTenancyRecords();
      console.log(response.data.message);
      setSnackbarMessage(
        response.data.message || "Tenant checked out successfully!"
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      resetForm(); // Clear all text fields after successful checkout
    } catch (error) {
      console.error("Checkout failed:", error);
      setSnackbarMessage(
        "No room or tenant selected. Please select both and try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchOccupiedRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        console.log("Response data rooms:", response.data);
        const rooms = response.data.getrooms;

        if (Array.isArray(rooms)) {
          const filteredRooms = rooms.filter(
            (room) => room.statusDetails.occupancy_status === "OCCUPIED"
          );
          console.log("filtered rooms:", filteredRooms);
          setAvailableRooms(filteredRooms);
        } else {
          console.error(
            "Expected 'getrooms' to be an array but got:",
            roomsArray
          );
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchOccupiedRooms();

    if (selectedRoom) {
      fetchTenancyRecord(selectedRoom);
    }
  }, [selectedRoom]);

  const fetchTenancyRecord = async (roomId) => {
    try {
      console.log("room ID:", roomId);

      const response = await axios.get(
        `http://localhost:3000/geteachtenancyrecord/${roomId}`
      );
      console.log("Tenancy record:", response.data);
      if (response.data && response.data.tenants) {
        const tenants = response.data.tenants;
        const tenantFullName = tenants
          ? `${tenants.first_name} ${tenants.last_name}`
          : "";
        const moveInFormatted = new Date(
          response.data.move_in_date
        ).toLocaleDateString();
        const moveOutFormatted = new Date(
          response.data.move_out_date
        ).toLocaleDateString();

        setTenantDetails(response.data.tenants);
        setSelectedTenant(tenantFullName);
        setMoveInDate(moveInFormatted);
        setMoveOutDate(moveOutFormatted);
        setDeposit(response.data.deposit);
        setContractMonths(response.data.period_of_stay);
      }
    } catch (error) {
      console.error("Failed to fetch tenancy record:", error);
    }
  };

  const handleRoomSelection = (event) => {
    const roomID = parseInt(event.target.value, 10);
    console.log("Selected Room ID:", roomID);
    const room = availableRooms.find((r) => r.room_id === roomID);
    setSelectedRoom(room ? room.room_id : null);

    fetchTenancyRecord(roomID);
  };

  const resetForm = () => {
    setSelectedRoom("");
    setSelectedTenant("");
    setContractMonths("");
    setContractMonthsLeft("");
    setDeposit("");
    setMoveInDate(null);
    setMoveOutDate(null);
    setMonthsLeft("");
    setDueDate("");
    setDayMonth("");
    setAddButtonClicked(false);
  };

  const handleAddButtonClick = () => {
    console.log("Add button clicked");

    setAddButtonClicked(true);

    const isContractMonthsValid =
      validateFloat(contractMonths) && contractMonths > 0;
    const isDepositValid = validateFloat(deposit) && deposit > 0;

    const isMoveInValid = moveInDate !== null;
    const isMoveOutValid = moveOutDate !== null;

    console.log({
      isContractMonthsValid,
      isDepositValid,
      isMoveInValid,
      isMoveOutValid,
    });

    if (
      !isContractMonthsValid ||
      !isDepositValid ||
      !isMoveInValid ||
      !isMoveOutValid
    ) {
      setSnackbarMessage("Please fill in all required fields correctly.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    } else {
      setOpenDialog(true);
    }
  };

  const validateFloat = (value) => {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue);
  };

  const validateInt = (value) => {
    const floatValue = parseInt(value);
    return !isNaN(floatValue);
  };

  const ITEM_HEIGHT = 48;
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position the Snackbar at the top right
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
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
                        onChange={handleRoomSelection}
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
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              style: {
                                maxHeight: ITEM_HEIGHT * 4.5, // Adjust number of items shown (4.5 in this example)
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em>No Room</em>
                        </MenuItem>
                        {availableRooms?.map((room) => (
                          <MenuItem key={room.room_id} value={room.room_id}>
                            {room.room_number}
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
                        value={moveInDate || ""} // Fallback to an empty string if moveInDate is null
                        sx={{ width: "40vw" }}
                      />
                      <Typography variant="h6" sx={{ margin: "0 10px" }}>
                        -
                      </Typography>

                      <TextField
                        id="moveoutdateId"
                        disabled
                        label="Move Out"
                        value={moveOutDate || ""} // Fallback to an empty string if moveOutDate is null
                        sx={{ width: "40vw" }}
                      />
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: "30px", marginTop: "10px" }}
                    >
                      <TextField
                        id="depositId"
                        disabled
                        label="Deposit"
                        value={deposit}
                        sx={{ width: "40vw" }}
                      />
                      <TextField
                        id="contractMonthsLeft"
                        label="Months Left"
                        sx={{ width: "40vw" }}
                        value={contractMonths}
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              Months
                            </InputAdornment>
                          ),
                          // readOnly: true,
                        }}
                        disabled
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
                    Check Out
                  </Button>
                </Box>
              </Box>

              <Card sx={{ width: "100%", marginLeft: "1vw" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    Recent Activity
                  </Typography>
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 6).map((activity) => (
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
                            {activity.moveIn}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography>No Recent Activity</Typography> // Display when there's no recent activity
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </div>
      </LocalizationProvider>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to proceed with adding the new tenant?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenDialog(false);
              handleCheckout();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
