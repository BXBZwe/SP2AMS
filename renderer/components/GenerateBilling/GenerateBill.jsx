import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Card, CardContent, TextField, MenuItem, Button, IconButton, Checkbox, Select } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { MobileDatePicker, LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
export default function GenerateBill() {
  const [rooms, setRooms] = useState([]);
  const [selectedOccupancyFilter, setSelectedOccupancyFilter] = useState("all");
  const occupancyFilterOptions = [
    { label: "All", value: "all" },
    { label: "Vacant", value: "VACANT" },
    { label: "Unavailable", value: "UNAVAILABLE" },
    { label: "Occupied", value: "OCCUPIED" },
  ];

  const filteredRooms = rooms.filter((room) => (selectedOccupancyFilter === "all" ? true : room.statusDetails.occupancy_status === selectedOccupancyFilter));

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        setRooms(response.data.getrooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const [selectedRoom, setSelectedRoom] = useState({
    room_id: "",
    room_number: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [year, setYear] = useState("");

  const [selectedRoomList, setSelectedRoomList] = useState([]);
  const [addAllChecked, setAddAllChecked] = useState(false);
  const [generateButtonClicked, setGenerateButtonClicked] = useState(false);
  const [billingDate, setBillingDate] = useState(null);

  console.log("Selecetd", selectedRoomList);

  const handleBillingDateChange = (newValue) => {
    setBillingDate(newValue);

    // Automatically set the month and year based on the billing date
    const date = new Date(newValue);
    const nextMonthDate = new Date(date.setMonth(date.getMonth() + 1)); // Add 1 month to billing date
    const nextMonth = nextMonthDate.toLocaleString("default", {
      month: "long",
    });
    const billingYear = nextMonthDate.getFullYear();

    setSelectedMonth(nextMonth); // Assuming you have a state variable for selectedMonth
    setYear(billingYear.toString()); // Assuming you have a state variable for year
  };

  const handleAddButtonClick = () => {
    if (selectedRoom.room_number) {
      setSelectedRoomList((prevList) => [...prevList, selectedRoom]);
      setSelectedRoom({ room_id: "", room_number: "" });
    }
  };

  const handleClearAllClick = () => {
    setSelectedRoomList([]);
    setAddAllChecked(false);
  };

  const handleAddAllClick = () => {
    const allRooms = rooms.map((room) => ({
      room_id: room.room_id,
      room_number: room.room_number,
    }));
    setSelectedRoomList(allRooms);
    setAddAllChecked(true);
  };

  const handleRemoveRoom = (roomIdToRemove) => {
    setSelectedRoomList((prevList) => prevList.filter((room) => room.room_id !== roomIdToRemove));
    setAddAllChecked(false);
  };

  useEffect(() => {}, [selectedRoomList]);

  // const handleGenerateButtonClick = () => {
  //   setGenerateButtonClicked(true);

  //   const isYearValid = validateInt(year) && year > 0;

  //   if (!isYearValid || !isMoveInValid) {
  //     return;
  //   }
  // };

  const handleGenerateButtonClick = async () => {
    setGenerateButtonClicked(true);
    console.log("Generate button clicked");

    if (selectedRoomList.length === 0) {
      alert("Please select at least one room.");
      return;
    }

    // const isYearValid = validateInt(year) && year > 0;
    // const isBillingDateValid = billingDate !== null;

    // if (!isYearValid || !isBillingDateValid) {
    //   return;
    // }

    // Formatting billingDate to the required format
    // const formattedGenerationDate = billingDate.toISOString();

    // Extract the month and year from the billing date for rent_month and rent_year

    const rentMonth = selectedMonth;
    const rentYear = parseInt(year, 10);

    console.log("month", selectedMonth);
    try {
      await Promise.all(
        selectedRoomList.map(async (room) => {
          const postData = {
            generation_date: billingDate,
            rent_month: rentMonth,
            room_id: room.room_id,
            rent_year: rentYear,
          };

          const response = await axios.post("http://localhost:3000/creategeneratebill", postData);
          // console.log("Bill generated for room", room.room_number, response.data);
        })
      );

      alert("Bills generated successfully for selected rooms.");
    } catch (error) {
      console.error("Error generating bills:", error);
    }
  };

  const validateInt = (value) => {
    const floatValue = parseInt(value);
    return !isNaN(floatValue);
  };

  const resetForm = () => {
    setBillingDate(null);
    setSelectedMonth("");
    setYear("");
    setGenerateButtonClicked(false);
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
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <Box>
                <Card sx={{ width: "50vw" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                        Select Rooms
                      </Typography>

                      <Select value={selectedOccupancyFilter} onChange={(e) => setSelectedOccupancyFilter(e.target.value)} sx={{ width: "80px" }}>
                        {occupancyFilterOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

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
                        value={selectedRoom.room_number}
                        onChange={(e) => {
                          const room = filteredRooms.find((room) => room.room_number === e.target.value);
                          setSelectedRoom({
                            room_id: room.room_id,
                            room_number: room.room_number,
                          });
                        }}
                        sx={{ width: "40vw" }}
                      >
                        {filteredRooms
                          .filter((room) => !selectedRoomList.map((r) => r.room_number).includes(room.room_number))
                          .map((room) => (
                            <MenuItem key={room.room_id} value={room.room_number}>
                              {room.room_number}
                            </MenuItem>
                          ))}
                      </TextField>

                      <Button variant="contained" size="small" sx={{ width: "10vw" }} onClick={handleAddButtonClick}>
                        Add
                      </Button>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox onClick={handleAddAllClick} checked={addAllChecked} />
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
                        <Typography variant="h6">Rooms selected for invoice generation</Typography>
                        <IconButton variant="contained" size="medium" onClick={handleClearAllClick}>
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
                            <Typography sx={{ marginRight: "8px" }}>{room.room_number}</Typography>
                            <IconButton onClick={() => handleRemoveRoom(room.room_id)}>
                              {" "}
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
                    Invoice Date
                  </Typography>
                  <DatePicker
                    id="billingdateId"
                    label="Generation Date"
                    value={billingDate}
                    onChange={handleBillingDateChange}
                    sx={{ width: "100%", marginBottom: "10px" }}
                    renderInput={(params) => <TextField {...params} error={generateButtonClicked && !billingDate} helperText={generateButtonClicked && !billingDate ? "Billing date is required!" : ""} />}
                  />

                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    For Month/Year
                  </Typography>
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <TextField id="monthId" label="Month" value={selectedMonth} sx={{ width: "50%", marginBottom: "10px" }} InputProps={{ readOnly: true }} />
                    <TextField id="yearId" label="Year" value={year} sx={{ width: "50%" }} InputProps={{ readOnly: true }} />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                    <Button sx={{ width: "40%" }} variant="outlined" onClick={resetForm}>
                      Clear
                    </Button>
                    <Button sx={{ width: "60%" }} variant="contained" onClick={handleGenerateButtonClick}>
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
