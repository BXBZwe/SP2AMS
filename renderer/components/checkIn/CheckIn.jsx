import { React, useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button, TextField, MenuItem, InputAdornment } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";

export default function CheckIn() {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [contractMonths, setContractMonths] = useState("");
  const [deposit, setDeposit] = useState("");
  const [moveInDate, setMoveInDate] = useState(null);
  const [moveOutDate, setMoveOutDate] = useState(null);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [newTenants, setNewTenants] = useState([]);

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

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        console.log("Response data rooms:", response.data);
        const rooms = response.data.getrooms;

        if (Array.isArray(rooms)) {
          const filteredRooms = rooms.filter((room) => room.statusDetails.occupancy_status === "Vacant");
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
          const filteredTenants = tenants.filter((tenant) => tenant.contract_status === "NEW");
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
      } catch (error) {
        console.error("Check-in failed:", error);
      }
    } else {
      console.error("No room or tenant selected.");
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
      return;
    }
    checkInTenant();
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

                      <DatePicker id="moveoutdateId" label="Move Out" value={moveOutDate} onChange={() => {}} renderInput={(props) => <TextField {...props} />} readOnly inputFormat="YYYY-MM-DD" sx={{ width: "40vw" }} />
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
    </>
  );
}
