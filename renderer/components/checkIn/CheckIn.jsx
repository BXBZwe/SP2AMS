import { React, useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography, Card, CardContent, Button, TextField, MenuItem, InputAdornment } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { Snackbar, Alert } from '@mui/material';

export default function CheckIn() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [contractMonths, setContractMonths] = useState("");
  const [deposit, setDeposit] = useState("");
  const [moveInDate, setMoveInDate] = useState(null);
  const [moveOutDate, setMoveOutDate] = useState(null);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [newTenants, setNewTenants] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // can be 'error', 'warning', 'info', 'success'
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        console.log("Response data rooms:", response.data);
        const rooms = response.data.getrooms;

        if (Array.isArray(rooms)) {
          const filteredRooms = rooms.filter((room) => room.statusDetails.occupancy_status === "VACANT");
          console.log("filtered rooms:", filteredRooms);
          setAvailableRooms(filteredRooms);
        } else {
          console.error("Expected 'getrooms' to be an array but got:", roomsArray);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    
    
    const fetchNewTenants = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getalltenants");
        const tenants = response.data.getTenant;
        if (Array.isArray(tenants)) {
          const filteredTenants = tenants.filter((tenant) => tenant.account_status === "ACTIVE" );
          console.log("Filtered tenants:", filteredTenants);
          setNewTenants(filteredTenants);
        }
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
      }
    };

    fetchAvailableRooms();
    fetchNewTenants();
  }, []);

  const handleContractMonthsChange = (e) => {
    const months = e.target.value;
    setContractMonths(months);
    if (moveInDate && months) {
      const moveInDayjs = dayjs(moveInDate);
      const moveOutDayjs = moveInDayjs.add(parseInt(months, 10), "month");
      console.log("Type of moveInDate:", typeof moveInDate, "Value of moveInDate:", moveInDate);
      console.log("Type of moveOutDayjs:", typeof moveOutDayjs, "Value of moveOutDayjs:", moveOutDayjs.format("YYYY-MM-DD"));
      setMoveOutDate(dayjs(moveOutDayjs));
    }
  };

  const handleMoveInDateChange = (date) => {
    setMoveInDate(date);
    if (moveOutDate && date > moveOutDate) {
      setMoveOutDate(date);
    }
  };

  const checkInTenant = async () => {
    if (selectedTenant && selectedRoom && moveOutDate) {
      try {
        const moveOutDateISO = moveOutDate.toISOString();

        const response = await axios.post("http://localhost:3000/checkintenant", {
          tenant_id: selectedTenant,
          room_id: selectedRoom,
          move_in_date: moveInDate,
          move_out_date: moveOutDateISO,
          period_of_stay: parseInt(contractMonths, 10),
          deposit: deposit,
        });
        console.log(response.data.message);
        // Display success Snackbar
        setSnackbarMessage(response.data.message || 'Tenant checked in successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        resetForm();
      } catch (error) {
        console.error("Check-in failed:", error);
        // Display error Snackbar for missing information
        setSnackbarMessage('No room or tenant selected. Please select both and try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      console.error("No room or tenant selected.");
      // Display error Snackbar for missing room or tenant selection
      setSnackbarMessage('No room or tenant selected. Please select both and try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleRoomSelection = (event) => {
    const roomID = parseInt(event.target.value, 10);
    const room = availableRooms.find((r) => r.room_id === roomID);
    setSelectedRoom(room ? room.room_id : null);
  };

  const handleTenantSelection = (event) => {
    const tenantID = parseInt(event.target.value, 10);
    const tenant = newTenants.find((t) => t.tenant_id === tenantID);
    setSelectedTenant(tenant ? tenant.tenant_id : null);
  };

  const resetForm = () => {
    setSelectedRoom("");
    setSelectedTenant("");
    setContractMonths("");
    setDeposit("");
    setMoveInDate(null);
    setMoveOutDate(null);
    setAddButtonClicked(false);
  };

  const handleAddButtonClick = () => {
    setAddButtonClicked(true);

    const isContractMonthsValid = validateFloat(contractMonths) && contractMonths > 0;
    const isDepositValid = validateFloat(deposit) && deposit > 0;

    const isMoveInValid = moveInDate !== null;
    const isMoveOutValid = moveOutDate !== null && moveOutDate > moveInDate;

    if (!isContractMonthsValid || !isDepositValid || !isMoveInValid || !isMoveOutValid) {
      setSnackbarMessage('Please fill in all required fields correctly.');
      setSnackbarSeverity('error');
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

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position the Snackbar at the top right
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
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
                      <TextField id="roomId" select label="Room Number" value={selectedRoom} onChange={handleRoomSelection} sx={{ width: "40vw", marginBottom: "10px" }} error={addButtonClicked && !selectedRoom} helperText={addButtonClicked && !selectedRoom ? "Please select a room." : ""}>
                        {availableRooms.map((room) => (
                          <MenuItem key={room.room_id} value={room.room_id}>
                            {room.room_number}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField id="tenantId" select label="Tenant Name" value={selectedTenant} onChange={handleTenantSelection} sx={{ width: "40vw" }} error={addButtonClicked && !selectedTenant} helperText={addButtonClicked && !selectedTenant ? "Please select a tenant." : ""}>
                        {newTenants.map((tenant) => (
                          <MenuItem key={tenant.tenant_id} value={tenant.tenant_id}>
                            {tenant.first_name} {tenant.last_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ width: "55vw" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                        error={addButtonClicked && (!moveInDate || moveInDate === "")}
                        helperText={addButtonClicked && (!moveInDate || moveInDate === "") ? "The field cannot be empty." : ""}
                      />

                      <Typography variant="h6" sx={{ margin: "0 10px" }}>
                        -
                      </Typography>

                      <DatePicker disabled id="moveoutdateId" label="Move Out" value={moveOutDate} onChange={() => {}} renderInput={(props) => <TextField {...props} />} readOnly inputFormat="YYYY-MM-DD" sx={{ width: "40vw" }} />
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
                        error={addButtonClicked && (!validateFloat(contractMonths) || contractMonths <= 0)}
                        helperText={addButtonClicked && (!validateFloat(contractMonths) || contractMonths <= 0) ? "Contract months must be a positive number." : ""}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">M</InputAdornment>,
                        }}
                        onChange={handleContractMonthsChange}
                      />

                      <TextField
                        id="deposit"
                        label="Deposit"
                        sx={{ width: "40vw" }}
                        value={deposit}
                        type="number"
                        error={addButtonClicked && (!validateFloat(deposit) || deposit <= 0)}
                        helperText={addButtonClicked && (!validateFloat(deposit) || deposit <= 0) ? "Deposit must be a positive number." : ""}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">THB</InputAdornment>,
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
                  <Button variant="outlined" sx={{ width: "20%" }} onClick={resetForm}>
                    Clear
                  </Button>

                  <Button variant="contained" sx={{ width: "20%" }} onClick={handleAddButtonClick}>
                    Check In
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
                        <Typography sx={{ marginRight: "8px" }}>{activity.room}</Typography>
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
                        <Typography sx={{ marginRight: "8px" }}>{activity.status}</Typography>
                      </Box>
                    </Box>
                  ))}
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
    <Button variant="outlined" onClick={() => setOpenDialog(false)}>Cancel</Button>
    <Button variant="contained" onClick={() => { setOpenDialog(false); checkInTenant(); }} autoFocus>
      Confirm
    </Button>
  </DialogActions>
</Dialog>


    </>
  );
}
