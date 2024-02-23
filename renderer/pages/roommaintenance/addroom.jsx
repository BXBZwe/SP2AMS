import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  List,
  ListContent,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  Fab,
} from "@mui/material";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import { useSnackbarContext } from "../../components/snackBar/SnackbarContent";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export default function AddRoom() {
  const theme = useTheme();
  const router = useRouter();
  const { openSnackbar } = useSnackbarContext();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState({
    room_number: "",
    floor: "",
    room_type: "",
    base_rent: "",
    deposit: "",
    statusDetails: {
      occupancy_status: "",
      is_reserved: false,
    },
    rates: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [rates, setRates] = useState([]);
  const [selectedRates, setSelectedRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredRates = rates.filter((rate) =>
    rate.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = showAll ? filteredRates : filteredRates.slice(0, 3);

  const roomTypes = ["Studio", "Deluxe", "Other"];
  const [customRoomType, setCustomRoomType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [items, setItems] = useState([]);

  useEffect(() => {
    if (formData.room_type && !roomTypes.includes(formData.room_type)) {
      setCustomRoomType(formData.room_type);
    }
  }, [formData.room_type]);

  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const handleAutocompleteChange = (event, newValue) => {
    // Check if "Other" is selected
    if (newValue === "Other") {
      setIsOtherSelected(true);
      // Set room_type to an empty string to allow for custom input
      setFormData({
        ...formData,
        room_type: "",
      });
    } else {
      setIsOtherSelected(false);
      setFormData({
        ...formData,
        room_type: newValue,
      });
    }
  };

  const handleCustomInputChange = (event) => {
    const { value } = event.target;
    // Update form data with the custom room type
    setFormData({
      ...formData,
      room_type: value,
    });
  };
  const handleFilter = () => {
    // Implement your filter logic here
    console.log("Filter button clicked");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // useEffect(() => {
  //   const fetchRates = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/getallrates");
  //       setRates(response.data.getRate);
  //     } catch (error) {
  //       console.error("Error fetching rates:", error);
  //     }
  //   };

  //   fetchRates();
  // }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrates");
        const ratesData = response.data.getRate;
  
        // Assuming ratesData is an array of rate objects
        setRates(ratesData);
  
        // Find and set default rates for Water and Electricity using their names
        const defaultRates = ratesData.reduce((acc, rate) => {
          if (rate.item_name === 'Water' || rate.item_name === 'Electricity') {
            acc.push({ rateId: rate.rate_id, quantity: 1 });
          }
          return acc;
        }, []);
  
        setSelectedRates(defaultRates);
        // console.log(defaultRates);
        console.log("Inside Fetch",selectedRates);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };
  
    fetchRates();
  }, []);
  console.log("Outside Fetch",selectedRates);


  const handleCheck = (rateId) => {
    setSelectedRates((prevSelectedRates) =>
      prevSelectedRates.includes(rateId)
        ? prevSelectedRates.filter((id) => id !== rateId)
        : [...prevSelectedRates, rateId]
    );
  };

  const handleRateChange = (rateId) => {
    setSelectedRates((currentSelectedRates) => {
      const isRateSelected = currentSelectedRates.some(
        (rate) => rate.rateId === rateId
      );
      if (isRateSelected) {
        return currentSelectedRates.filter((rate) => rate.rateId !== rateId);
      } else {
        return [...currentSelectedRates, { rateId, quantity: null }];
      }
    });
  };

  const handleQuantityChange = (rateId, quantity) => {
    setSelectedRates((currentSelectedRates) => {
      if (!quantity) {
        return currentSelectedRates.filter((rate) => rate.rateId !== rateId);
      }

      quantity = Math.max(1, quantity);

      const rateIndex = currentSelectedRates.findIndex(
        (rate) => rate.rateId === rateId
      );
      if (rateIndex >= 0) {
        const newSelectedRates = [...currentSelectedRates];
        newSelectedRates[rateIndex].quantity = quantity;
        return newSelectedRates;
      } else {
        return [...currentSelectedRates, { rateId, quantity }];
      }
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.includes("statusDetails.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        statusDetails: {
          ...formData.statusDetails,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === "statusDetails.is_reserved") {
      setFormData({
        ...formData,
        statusDetails: {
          ...formData.statusDetails,
          is_reserved: checked,
          occupancy_status: checked ? "UNAVAILABLE" : "",
        },
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSnackbarOpen(true);
      return; 
    }
    setOpenDialog(true); 
  };

  const handleConfirmAdd = async () => {
    const updatedFormData = {
      ...formData,
      floor: parseInt(formData.floor, 10) || 0, 
      rates: selectedRates.map((rate) => ({
        rate_id: rate.rateId, 
        quantity: rate.quantity, 
      })),
    };

    try {
      await axios.post("http://localhost:3000/addrooms", updatedFormData);
      openSnackbar("Room Added successfully!", "success");
      setTimeout(() => {
        router.push("/roomMaintenance"); 
      }, 500);
      setOpenDialog(false); 

      setFormData({
        room_number: "",
        floor: "",
        room_type: "",
        base_rent: "",
        deposit: "",
        statusDetails: {
          occupancy_status: "",
          is_reserved: false,
        },
      });
      setSelectedRates([]);
    } catch (error) {
      console.error("Error adding room:", error);
      setSnackbarOpen(true); 
      setOpenDialog(false); 
    }
  };
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCancelClick = () => {
    router.back();
  };

  const occupancyOptions = ["VACANT", "OCCUPIED", "UNAVAILABLE"];

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.room_number = formData.room_number
      ? ""
      : "Room number is required.";
    tempErrors.floor = formData.floor ? "" : "Floor is required.";
    tempErrors.room_type = formData.room_type ? "" : "Room type is required.";
    tempErrors.base_rent = formData.base_rent ? "" : "Base rent is required.";
    tempErrors.deposit = formData.deposit ? "" : "Deposit is required.";
    tempErrors.occupancy_status = formData.statusDetails.occupancy_status
      ? ""
      : "Occupancy status is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const renderSelectedRatesSummary = () => {
    return rates
      .filter((rate) => selectedRates.includes(rate.rate_id))
      .map((rate) => (
        <ListItem key={rate.rate_id}>
          <ListItemText
            primary={`${rate.item_name} - ${rate.item_price}`}
            secondary={rate.item_description}
          />
        </ListItem>
      ));
  };
  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: "10px" }}>
        <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
          <Typography variant="h4">Add New Room</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Configure New Room Details
          </Typography>
        </CardContent>
        <CardContent>
          <Button
            variant="outlined"
            sx={{ width: "110px", marginTop: "15px", marginRight: "10px" }}
            onClick={handleCancelClick}
          >
            Back
          </Button>
          <Button
            variant="contained"
            sx={{ width: "110px", marginTop: "15px" }}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box>
          <Card sx={{ width: "55vw", marginBottom: "10px", padding: "10px" }}>
            <Typography variant="h6" sx={{ marginBottom: "16px" }}>
              Enter Room Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <TextField
                label="Room Number"
                name="room_number"
                value={formData.room_number}
                onChange={handleInputChange}
                required
                error={!!errors.room_number}
                helperText={errors.room_number}
                sx={{
                  width: "50%",
                }}
              />
              <TextField
                label="Floor"
                name="floor"
                type="number"
                value={formData.floor}
                onChange={handleInputChange}
                required
                error={!!errors.floor}
                helperText={errors.floor}
                sx={{
                  width: "50%",
                  marginLeft: "10px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                marginTop: "10px",
              }}
            >
              {" "}
              <TextField
                label="Base Rent"
                name="base_rent"
                type="number"
                value={formData.base_rent}
                onChange={handleInputChange}
                required
                error={!!errors.base_rent}
                helperText={errors.base_rent}
                sx={{
                  width: "50%",
                }}
              />
              <TextField
                label="Deposit"
                name="deposit"
                type="number"
                value={formData.deposit}
                onChange={handleInputChange}
                required
                error={!!errors.deposit}
                helperText={errors.deposit}
                sx={{
                  width: "50%",
                  marginLeft: "10px",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <Autocomplete
                  sx={{ mb: "10px" }}
                  options={roomTypes}
                  value={isOtherSelected ? "Other" : formData.room_type || ""}
                  onChange={handleAutocompleteChange}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Room Type"
                      error={!!errors.room_type}
                      helperText={errors.room_type}
                    />
                  )}
                />
                {isOtherSelected && (
                  <TextField
                    label="Custom Room Type"
                    value={formData.room_type}
                    onChange={handleCustomInputChange}
                    fullWidth
                    error={!!errors.room_type}
                    helperText={errors.room_type}
                  />
                )}
              </Box>
              <Autocomplete
                sx={{ width: "50%", marginLeft: "10px" }}
                options={occupancyOptions}
                value={formData.statusDetails.occupancy_status}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    statusDetails: {
                      ...formData.statusDetails,
                      occupancy_status: newValue || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Occupancy Status"
                    error={!!errors.occupancy_status}
                    helperText={errors.occupancy_status}
                  />
                )}
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="statusDetails.is_reserved"
                    checked={formData.statusDetails.is_reserved}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Is Reserved"
              />
            </Box>
          </Card>
          <Card sx={{ width: "55vw", marginBottom: "10px", padding: "10px" }}>
            <Typography variant="h6" sx={{ marginBottom: "16px" }}>
              Additional Items
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
                <TextField
                  label="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  size="small"
                  sx={{ mr: 2 }}
                />
                {selectedRates.length > 3 && (
                  <Button
                    variant="outlined"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Show Less" : "Show All"}
                  </Button>
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Fab
                  size="small"
                  color="primary"
                  onClick={handleOpenDialog}
                  aria-label="add item"
                >
                  <AddIcon />
                </Fab>
              </Box>
            </Box>
            {selectedRates.length > 0 ? (
              selectedRates.map((selectedRate) => {
                const rate = filteredItems.find(
                  (rate) => rate.rate_id === selectedRate.rateId
                );
                return (
                  rate && (
                    <Grid
                      container
                      key={rate.rate_id}
                      alignItems="center"
                      sx={{ marginBottom: "10px" }}
                    >
                      <Grid item xs={8}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked
                              onChange={() => handleRateChange(rate.rate_id)}
                            />
                          }
                          label={`${rate.item_name} - ${rate.item_price}`}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Quantity"
                          type="number"
                          size="small"
                          sx={{ ml: 2, width: "90px" }}
                          value={selectedRate.quantity || ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              rate.rate_id,
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          InputProps={{ inputProps: { min: 1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ marginLeft: "8px" }}>
                        <Typography variant="body2">
                          {rate.item_description}
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                );
              })
            ) : (
              <Typography sx={{ marginLeft: "8px", marginTop: "20px" }}>
                No additional items selected.
              </Typography>
            )}
          </Card>
        </Box>
        <Card sx={{ width: "100%", marginLeft: "1vw" }}>
          <CardContent>
            <Typography variant="h6">Room Summary</Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary={`Room Number: ${formData.room_number}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Base Rent: ${formData.base_rent}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Deposit: ${formData.deposit}`} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Occupancy Status: ${formData.statusDetails.occupancy_status}`}
                />
              </ListItem>
              <ListItem>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Is Reserved: ${
                    formData.statusDetails.is_reserved ? "Yes" : "No"
                  }`}
                />
              </ListItem>
              {renderSelectedRatesSummary()}
            </List>
          </CardContent>
        </Card>{" "}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{`Add Room ${formData.room_number}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to add this room?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" autoFocus onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            // color="success"
            onClick={handleConfirmAdd}
            autoFocus
          >
            Confirm Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position top-right
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Please enter all fields
        </MuiAlert>
      </Snackbar>

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select Items</DialogTitle>
        <DialogContent>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ mt: 2 }}
          />
          <List>
            {filteredRates.map((item) => (
              <ListItem key={item.rate_id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRates.some(
                        (selectedRate) => selectedRate.rateId === item.rate_id
                      )}
                      onChange={() => handleRateChange(item.rate_id)}
                    />
                  }
                  label={`${item.item_name} - ${item.item_price}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
