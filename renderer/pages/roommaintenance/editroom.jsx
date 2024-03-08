import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  DialogContentText,
  Autocomplete,
  Grid,
  Fab,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useSnackbarContext } from "../../components/snackBar/SnackbarContent";
import AddIcon from "@mui/icons-material/Add";
import { useAPI } from "../../components/ratemaintenance/apiContent";

export default function EditRoom() {
  const router = useRouter();
  const { openSnackbar } = useSnackbarContext();
  const { roomId } = router.query;
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
  const [editable, setEditable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedRates, setSelectedRates] = useState([]);
  const [remainingRates, setRemainingRates] = useState([]);
  const roomTypes = ["Studio", "Deluxe", "Other"];
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { rates, fetchRates } = useAPI();
  // console.log(rates)
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const filteredRates = rates.filter((rate) =>
    rate.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = showAll ? filteredRates : filteredRates.slice(0, 3);

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
  const renderSelectedRatesSummary = () => {
    return formData.rates
      .filter(rate => rate.quantity > 0) // Assuming quantity indicates selection
      .map((rate) => (
        <ListItem key={rate.rateId}>
          <ListItemText
            primary={`${rate.item_name} - ${rate.item_price}`}
            secondary={rate.item_description}
          />
        </ListItem>
      ));
  };
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/geteachroom/${roomId}`
        );
        const roomData = response.data.room;

        // Prepare rates data for the formData state
        const ratesData = roomData.room_rates.map((rate) => ({
          rateId: rate.rate_id,
          quantity: rate.quantity,
          item_name: rate.rates.item_name,
          item_price: rate.rates.item_price,
          item_description: rate.rates.item_description,
          last_updated: rate.rates.last_updated,
        }));

        // Separate rates into selected and remaining
        const selected = ratesData;
        const selectedRateIds = roomData.room_rates.map((rate) => rate.rate_id);
        const filterRates = rates.filter(
          (rate) => !selectedRateIds.includes(rate.rate_id)
        );
        const remaining = filterRates.map((rate) => ({
          item_description: rate.item_description,
          item_name: rate.item_name,
          item_price: rate.item_price,
          last_updated: rate.last_updated,
          quantity: 1,
          rateId: rate.rate_id,
        }));

        // console.log("Selected", selected);
        // console.log("Remaining", remaining);

        setSelectedRates(selected);
        setRemainingRates(remaining);

        // Set the fetched room details and rates into the formData state
        setFormData({
          ...roomData,
          statusDetails: {
            occupancy_status: roomData.statusDetails.occupancy_status,
            is_reserved: roomData.statusDetails.is_reserved,
            payment_status: roomData.statusDetails.payment_status,
          },
          rates: ratesData,
        });

        setRoomNumber(roomData.room_number);
        setInitialData(roomData);
      } catch (error) {
        console.error("Error fetching room:", error.message);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  // console.log("Form Data", formData.rates);

  // Function to generate the change summary
  const generateChangeSummary = () => {
    if (!initialData) return "";

    let changes = [];
    if (initialData.room_number !== formData.room_number) {
      changes.push(
        `Room Number: ${initialData.room_number} -> ${formData.room_number}`
      );
    }
    if (initialData.deposit !== formData.deposit) {
      changes.push(`Deposit: ${initialData.deposit} -> ${formData.deposit}`);
    }

    if (initialData.floor !== formData.floor) {
      changes.push(`Floor: ${initialData.floor} -> ${formData.floor}`);
    }

    if (initialData.base_rent !== formData.base_rent) {
      changes.push(
        `Base Rent: ${initialData.base_rent} -> ${formData.base_rent}`
      );
    }

    if (initialData.room_type !== formData.room_type) {
      changes.push(
        `Room Type: ${initialData.room_type} -> ${formData.room_type}`
      );
    }
    if (
      initialData.statusDetails.occupancy_status !==
      formData.statusDetails.occupancy_status
    ) {
      changes.push(
        `Occupancy Status: ${initialData.statusDetails.occupancy_status} -> ${formData.statusDetails.occupancy_status}`
      );
    }
    if (
      initialData.statusDetails.payment_status !==
      formData.statusDetails.payment_status
    ) {
      changes.push(
        `Payment Status: ${initialData.statusDetails.payment_status} -> ${formData.statusDetails.payment_status}`
      );
    }
    // Add more fields comparison as needed

    return changes.length > 0 ? (
      changes.join(", ")
    ) : (
      <Typography>No changes made.</Typography>
    );
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

  // const handleRateChange = (rateId) => {
  //   setFormData((prevFormData) => {
  //     const newRates = prevFormData.rates.map((rate) => {
  //       if (rate.rateId === rateId) {
  //         return { ...rate, quantity: rate.quantity > 0 ? 0 : 1 }; // Toggle quantity between 0 and 1
  //       }
  //       return rate;
  //     });
  //     return { ...prevFormData, rates: newRates };
  //   });
  // };

  const handleRateChange = (rateId) => {
    setFormData((prevFormData) => {
      const newRates = prevFormData.rates.map((rate) => {
        if (rate.rateId === rateId) {
          return { ...rate, quantity: rate.quantity > 0 ? 0 : 1 }; // Toggle quantity between 0 and 1
        }
        return rate;
      });
      return { ...prevFormData, rates: newRates };
    });
  };

  const handleAddNewItem = (item) => {
    setRemainingRates((prevRemainingRates) => {
      return prevRemainingRates.filter((rate) => rate.rateId !== item.rateId);
    });
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        rates: [...prevFormData.rates, item], // Add the new item to the rates array
      };
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleQuantityChange = (rateId, newQuantity) => {
    setFormData((prevFormData) => {
      const newRates = prevFormData.rates.map((rate) => {
        if (rate.rateId === rateId) {
          return { ...rate, quantity: newQuantity };
        }
        return rate;
      });
      return { ...prevFormData, rates: newRates };
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === "statusDetails.is_reserved") {
      // Determine the new occupancy status based on the checked state of the "Is Reserved" checkbox
      const newOccupancyStatus = checked ? "UNAVAILABLE" : "VACANT";

      setFormData({
        ...formData,
        statusDetails: {
          ...formData.statusDetails,
          is_reserved: checked,
          occupancy_status: newOccupancyStatus,
        },
      });
    } else {
      // Handle other checkboxes if any
    }
  };

  // const toggleEdit = () => {
  //   setEditable(!editable);
  //   if (editable) {
  //     setErrors({});
  //   }
  // };

  const [initialFormData, setInitialFormData] = useState(formData);

  const toggleEdit = () => {
    if (!editable) {
      // Entering edit mode, save the current state as the initial state
      setInitialFormData(formData);
    } else {
      // Exiting edit mode, reset to the initial state
      setFormData(initialFormData);
    }
    setEditable(!editable);
    if (editable) {
      setErrors({});
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Room Addtion Failed
        </MuiAlert>
      </Snackbar>;
      return setOpenDialog(false);
    }
    setOpenDialog(true);
  };

  const handleConfirmSave = async () => {
    // Convert 'floor' to an integer and prepare rates data
    const updatedFormData = {
      ...formData,
      floor: parseInt(formData.floor, 10) || 0, // Convert to integer, default to 0 if NaN
      rates: formData.rates
        .filter((rate) => rate.quantity > 0) // Include only rates with a quantity greater than 0
        .map((rate) => ({
          rate_id: rate.rateId,
          quantity: parseInt(rate.quantity, 10), // Ensure quantity is an integer
        })),
    };

    setRoomNumber(updatedFormData.room_number);

    // console.log(updatedFormData)

    try {
      await axios.put(
        `http://localhost:3000/updaterooms/${roomId}`,
        updatedFormData
      );
      openSnackbar("Room updated successfully!", "success");
      setTimeout(() => {
        router.push("/roomMaintenance"); // Redirect to the room maintenance page
      }, 500);
    } catch (error) {
      console.error("Error updating room details:", error.message);
      // Optionally, show an error message to the user
      openSnackbar("Failed to update room. Please try again.", "error");
    } finally {
      setOpenDialog(false);
      setEditable(false);
    }
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAddDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const occupancyOptions = ["VACANT", "OCCUPIED", "UNAVAILABLE"];
  const paymentStatus = ["PENDING", "OVERDUE", "PARTIAL", "PAID"];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleSelectChange = (name) => (event) => {
    const { value } = event.target;
    if (name.includes("statusDetails.")) {
      const field = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        statusDetails: {
          ...prevFormData.statusDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

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

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
        <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
          <Typography variant="h4">Edit Room {roomNumber}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Configure Room Details
          </Typography>
        </CardContent>
        <CardContent>
          {!editable ? (
            <>
                          <Button
                variant="outlined"
                sx={{ width: "110px", marginTop: "15px", marginRight: "10px" }}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{ width: "110px", marginTop: "15px" }}
                onClick={toggleEdit}
              >
                Edit
              </Button>

            </>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{ width: "110px", marginTop: "15px" }}
                onClick={toggleEdit}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ width: "110px", marginTop: "15px", marginLeft: "10px" }}
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box>
          <Card sx={{ width: "55vw", marginBottom: "10px", padding: "10px" }}>
            <CardContent>
              <Typography variant="h6">Edit Room Details</Typography>

              {/* Room Details Form Fields */}
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <TextField
                  disabled={!editable}
                  label="Floor"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  error={!!errors.floor}
                  helperText={errors.floor}
                  sx={{
                    width: "50%",
                  }}
                />
                <TextField
                  disabled={!editable}
                  label="Room Number"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  error={!!errors.room_number}
                  helperText={errors.room_number}
                  sx={{
                    width: "50%",
                    marginLeft: "10px",
                  }}
                />
              </Box>
              <Box sx={{ width: "100%", display: "flex" }}>
                <TextField
                  disabled={!editable}
                  label="Base Rent"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="base_rent"
                  value={formData.base_rent}
                  onChange={handleInputChange}
                  error={!!errors.base_rent}
                  helperText={errors.base_rent}
                  sx={{ width: "50%" }}
                />
                <TextField
                  disabled={!editable}
                  label="Deposit"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  error={!!errors.deposit}
                  helperText={errors.deposit}
                  sx={{ width: "50%", marginLeft: "10px" }}
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
                    disabled={!editable}
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
                      disabled={!editable}
                      label="Custom Room Type"
                      value={formData.room_type}
                      onChange={handleCustomInputChange}
                      fullWidth
                      error={!!errors.room_type}
                      helperText={errors.room_type}
                    />
                  )}
                </Box>

                {/* <Autocomplete
                  // disabled={!editable}
                  disabled
                  sx={{
                    width: "50%",
                    marginLeft: "10px",
                    ".MuiAutocomplete-root": {
                      marginTop: 0,
                    },
                  }}
                  options={occupancyOptions}
                  value={formData.statusDetails.occupancy_status}
                  onChange={(event, newValue) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      statusDetails: {
                        ...prevFormData.statusDetails,
                        occupancy_status: newValue || "",
                      },
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Occupancy Status"
                      variant="outlined"
                      error={!!errors.occupancy_status}
                      helperText={errors.occupancy_status}
                    />
                  )}
                /> */}

                <Autocomplete
                  sx={{
                    width: "50%",
                    marginLeft: "10px",
                    ".MuiAutocomplete-root": {
                      marginTop: 0,
                    },
                  }}
                  options={occupancyOptions}
                  value={formData.statusDetails.occupancy_status}
                  onChange={(event, newValue) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      statusDetails: {
                        ...prevFormData.statusDetails,
                        occupancy_status: newValue || "",
                      },
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Occupancy Status"
                      variant="outlined"
                      error={!!errors.occupancy_status}
                      helperText={errors.occupancy_status}
                    />
                  )}
                  disabled
                />
              </Box>

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={
                        !editable ||
                        formData.statusDetails.occupancy_status === "OCCUPIED"
                      }
                      name="statusDetails.is_reserved"
                      checked={formData.statusDetails.is_reserved}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Is Reserved"
                />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: "55vw", marginBottom: "10px", padding: "10px" }}>
            <Typography variant="h6" sx={{ marginBottom: "16px" }}>
              Additional Items
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Fab
              disabled={!editable}
                size="small"
                color="primary"
                onClick={handleOpenAddDialog}
                aria-label="add item"
              >
                <AddIcon />
              </Fab>
            </Box>
            {formData.rates.map((rate) => (
              <Grid
                container
                key={rate.rateId}
                alignItems="center"
                sx={{ marginBottom: "10px" }}
              >
                <Grid item xs={8}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rate.quantity > 0}
                        onChange={() => handleRateChange(rate.rateId)}
                        disabled={!editable}
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
                    value={rate.quantity || ""}
                    onChange={(e) =>
                      handleQuantityChange(rate.rateId, e.target.value)
                    }
                    InputProps={{ inputProps: { min: 1 } }}
                    disabled={!editable}
                  />
                </Grid>
              </Grid>
            ))}
          </Card>
        </Box>
        <Card sx={{ width: "100%", marginLeft: "1vw" }}>
  <CardContent>
    <Typography variant="h6">Room Summary</Typography>
    <List dense>
      <ListItem>
        <ListItemText primary={`Room Number: ${formData.room_number}`} />
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
        <ListItemText
          primary={`Is Reserved: ${formData.statusDetails.is_reserved ? "Yes" : "No"}`}
        />
      </ListItem>
      {renderSelectedRatesSummary()}
    </List>
  </CardContent>
</Card>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {/* <Typography variant="h5"> */}
          Update Room {formData.room_number}
          {/* </Typography> */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this room?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmSave} autoFocus>
            Confirm Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Room updated successfully!
        </MuiAlert>
      </Snackbar>
      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseDialog}>
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
            {remainingRates.map((item) => (
              <ListItem key={item.rateId}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={false} // Since these are remaining rates, they are not selected
                      onChange={() => handleAddNewItem(item)}
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