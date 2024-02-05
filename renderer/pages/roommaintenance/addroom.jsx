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
} from "@mui/material";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
// import { useSnackbarContext } from './SnackbarContext'; // Adjust the import path as needed
import { useSnackbarContext } from "../../components/snackBar/SnackbarContent";

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
      payment_status: "",
    },
    rates: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [rates, setRates] = useState([]);
  const [selectedRates, setSelectedRates] = useState([]);
  // console.log('selected Rates',selectedRates)

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrates");
        setRates(response.data.getRate);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchRates();
  }, []);

  const handleCheck = (rateId) => {
    setSelectedRates((prevSelectedRates) =>
      prevSelectedRates.includes(rateId)
        ? prevSelectedRates.filter((id) => id !== rateId)
        : [...prevSelectedRates, rateId]
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

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === "statusDetails.is_reserved") {
      setFormData({
        ...formData,
        statusDetails: {
          ...formData.statusDetails,
          is_reserved: checked,
          // Set occupancy status to "Unavailable" if checked, or clear it if unchecked
          occupancy_status: checked ? "Unavailable" : "",
        },
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSnackbarOpen(true);
      return; // Exit the function if validation fails
    }
    setOpenDialog(true); // Open the dialog on form submission
  };

  const handleConfirmAdd = async () => {
    // if (!validateForm()) {
    //   setSnackbarOpen;
    //   return;
    // }

    // Convert 'floor' to an integer
    const updatedFormData = {
      ...formData,
      floor: parseInt(formData.floor, 10) || 0, // Convert to integer, default to 0 if NaN
      rates: selectedRates,
    };
    try {
      await axios.post("http://localhost:3000/addrooms", updatedFormData);
      openSnackbar("Room Added successfully!", "success");
      setTimeout(() => {
        router.push("/roomMaintenance"); // Redirect to the room maintenance page
      }, 500);
      setOpenDialog(false); // Close confirmation dialog

      // Reset the form to its default state
      setFormData({
        room_number: "",
        floor: "",
        room_type: "",
        base_rent: "",
        deposit: "",
        statusDetails: {
          occupancy_status: "",
          is_reserved: false,
          payment_status: "",
        },
      });
      setSelectedRates([]);
    } catch (error) {
      console.error("Error adding room:", error);
      setSnackbarOpen(true); // Optionally show an error message instead
      setOpenDialog(false); // Close confirmation dialog
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const occupancyOptions = ["Vacant", "Occupied", "Unavailable"];
  const paymentOptions = ["PENDING", "OVERDUE", "PARTIAL", "PAID"];

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
    tempErrors.payment_status = formData.statusDetails.payment_status
      ? ""
      : "Payment status is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  // Function to render the summary of selected rates
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
                justifyContent: "space-between",
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
              />
              <TextField
                label="Room Type"
                name="room_type"
                value={formData.room_type}
                onChange={handleInputChange}
                required
                error={!!errors.room_type}
                helperText={errors.room_type}
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
                sx={{ marginRight: "10px" }}
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
              />
            </Box>

            <Box
              sx={{ marginTop: "10px", display: "flex", flexDirection: "row" }}
            >
              {" "}
              <Autocomplete
                sx={{ width: "100%", marginRight: "5px" }}
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
              <Autocomplete
                sx={{ width: "100%", marginLeft: "5px" }}
                options={paymentOptions}
                value={formData.statusDetails.payment_status}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    statusDetails: {
                      ...formData.statusDetails,
                      payment_status: newValue || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Payment Status"
                    error={!!errors.payment_status}
                    helperText={errors.payment_status}
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
            {rates.map((rate) => (
              <Box
                key={rate.rate_id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRates.includes(rate.rate_id)}
                      onChange={() => handleCheck(rate.rate_id)}
                    />
                  }
                  label={`${rate.item_name} - ${rate.item_price}`}
                />
                <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                  {rate.item_description}
                </Typography>
              </Box>
            ))}
          </Card>
        </Box>
        <Card sx={{ width: "100%", marginLeft: "1vw", marginTop: "10px" }}>
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
                <ListItemText
                  primary={`Payment Status: ${formData.statusDetails.payment_status}`}
                />
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
    </>
  );
}
