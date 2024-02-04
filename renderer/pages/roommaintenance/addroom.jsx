import React, { useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, Typography, TextField, Box, Button, Checkbox, FormControlLabel, Autocomplete, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Snackbar, Alert } from "@mui/material";
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
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
          is_available_for_rent: true,
          payment_status: "",
        },
      });
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
    tempErrors.room_number = formData.room_number ? "" : "Room number is required.";
    tempErrors.floor = formData.floor ? "" : "Floor is required.";
    tempErrors.room_type = formData.room_type ? "" : "Room type is required.";
    tempErrors.base_rent = formData.base_rent ? "" : "Base rent is required.";
    tempErrors.deposit = formData.deposit ? "" : "Deposit is required.";
    tempErrors.occupancy_status = formData.statusDetails.occupancy_status ? "" : "Occupancy status is required.";
    tempErrors.payment_status = formData.statusDetails.payment_status ? "" : "Payment status is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
        <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
          <Typography variant="h4">Add New Room</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Configure New Room Details
          </Typography>
        </CardContent>
        <CardContent>
          <Button variant="contained" sx={{ width: "110px", marginTop: "15px" }} onClick={handleSubmit}>
            Add
          </Button>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, margin: 2 }}>
          {/* TextFields for room_number, floor, room_type, base_rent, deposit */}
          <TextField label="Room Number" name="room_number" value={formData.room_number} onChange={handleInputChange} required error={!!errors.room_number} helperText={errors.room_number} />
          <TextField label="Floor" name="floor" type="number" value={formData.floor} onChange={handleInputChange} required error={!!errors.floor} helperText={errors.floor} />
          <TextField label="Room Type" name="room_type" value={formData.room_type} onChange={handleInputChange} required error={!!errors.room_type} helperText={errors.room_type} />
          <TextField label="Base Rent" name="base_rent" type="number" value={formData.base_rent} onChange={handleInputChange} required error={!!errors.base_rent} helperText={errors.base_rent} />
          <TextField label="Deposit" name="deposit" type="number" value={formData.deposit} onChange={handleInputChange} required error={!!errors.deposit} helperText={errors.deposit} />

          {/* Autocomplete for occupancy_status */}
          {/* <Autocomplete
            options={occupancyOptions}
            value={formData.statusDetails.occupancy_status}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                statusDetails: {
                  ...formData.statusDetails,
                  occupancy_status: newValue,
                },
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Occupancy Status" />
            )}
          /> */}

          <Autocomplete
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
            renderInput={(params) => <TextField {...params} label="Occupancy Status" error={!!errors.occupancy_status} helperText={errors.occupancy_status} />}
          />

          <Autocomplete
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
            renderInput={(params) => <TextField {...params} label="Payment Status" error={!!errors.payment_status} helperText={errors.payment_status} />}
          />

          {/* Checkbox for is_reserved */}
          <FormControlLabel control={<Checkbox name="statusDetails.is_reserved" checked={formData.statusDetails.is_reserved} onChange={handleCheckboxChange} />} label="Is Reserved" />
        </Box>
      </form>

      {/* Confirmation Dialog */}
      <Dialog fullScreen={fullScreen} open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{`Add Room ${formData.room_number}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to add this room?</DialogContentText>
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
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          Please enter all fields
        </MuiAlert>
      </Snackbar>
    </>
  );
}
