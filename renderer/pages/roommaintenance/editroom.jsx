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
  DialogContentText
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useSnackbarContext } from "../../components/snackBar/SnackbarContent";

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
      is_reserved: true,
      payment_status: "",
    },
  });
  const [editable, setEditable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/geteachroom/${roomId}`
        );
        setFormData(response.data.room);
        setRoomNumber(response.data.room.room_number);
        setInitialData(response.data.room);
      } catch (error) {
        console.error("Error fetching room:", error.message);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

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
      changes.push(`Base Rent: ${initialData.base_rent} -> ${formData.base_rent}`);
    }

    if (initialData.room_type !== formData.room_type) {
      changes.push(`Room Type: ${initialData.room_type} -> ${formData.room_type}`);
    }
    if (initialData.statusDetails.occupancy_status !== formData.statusDetails.occupancy_status) {
      changes.push(`Occupancy Status: ${initialData.statusDetails.occupancy_status} -> ${formData.statusDetails.occupancy_status}`);
    }
    if (initialData.statusDetails.payment_status !== formData.statusDetails.payment_status) {
      changes.push(`Payment Status: ${initialData.statusDetails.payment_status} -> ${formData.statusDetails.payment_status}`);
    }
    // Add more fields comparison as needed

    return changes.length > 0 ? changes.join(", ") : (<Typography>No changes made.</Typography>);
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
    } else {
      // Handle other checkboxes if any
    }
  };

  const toggleEdit = () => {
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position top-right
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
    // Convert 'floor' to an integer
    const updatedFormData = {
      ...formData,
      floor: parseInt(formData.floor, 10) || 0, // Convert to integer, default to 0 if NaN
    };
    setRoomNumber(updatedFormData.room_number);

    try {
      await axios.put(
        `http://localhost:3000/updaterooms/${roomId}`,
        updatedFormData
      );
      // setSnackbarOpen(true);
      openSnackbar("Room updated successfully!", "success");
      setTimeout(() => {
        router.push("/roomMaintenance"); // Redirect to the room maintenance page
      }, 500);
    } catch (error) {
      console.error("Error updating room details:", error.message);
    } finally {
      setOpenDialog(false);
      setEditable(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const status = ["Vacant", "Occupied", "Unavailable"];
  const paymentStatus = ["PENDING", "OVERDUE", "PARTIAL", "PAID"];
  const is_reserved = ["true", "false"];
  const is_available_for_rent = ["true", "false"];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // const handleSelectChange = (name) => (event) => {
  //   setFormData({ ...formData, [name]: event.target.value });
  //   console.log(formData.occupancy_status);
  // };

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
    tempErrors.payment_status = formData.statusDetails.payment_status
      ? ""
      : "Payment status is required.";

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
          {editable && (
            <Button
              variant="outlined"
              sx={{ width: "110px", marginTop: "15px" }}
              onClick={toggleEdit}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            sx={{ width: "110px", marginTop: "15px", marginLeft: "10px" }}
            onClick={editable ? handleSave : toggleEdit}
          >
            {editable ? "Save" : "Edit"}
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", marginTop: "10px" }}>
        <Card sx={{ width: "70%", display: "flex", marginBottom: "5px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Enter Room Details
            </Typography>

            {/* Room Details Form Fields */}
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
            />
            <TextField
              disabled={!editable}
              label="Rent"
              variant="outlined"
              fullWidth
              margin="dense"
              name="base_rent"
              value={formData.base_rent}
              onChange={handleInputChange}
              error={!!errors.base_rent}
              helperText={errors.base_rent}
            />
            <TextField
              disabled={!editable}
              label="Room Type"
              name="room_type"
              fullWidth
              value={formData.room_type}
              onChange={handleInputChange}
              required
              error={!!errors.room_type}
              helperText={errors.room_type}
            />

            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>Room Occupancy</InputLabel>
              <Select
                disabled={!editable}
                value={formData.statusDetails.occupancy_status}
                label="Room Occupancy"
                onChange={handleSelectChange("statusDetails.occupancy_status")}
              >
                {status.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>Payment Status</InputLabel>
              <Select
                disabled={!editable}
                value={formData.statusDetails.payment_status}
                label="Payment Status"
                onChange={handleSelectChange("statusDetails.payment_status")}
              >
                {paymentStatus.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!editable}
                  name="statusDetails.is_reserved"
                  checked={formData.statusDetails.is_reserved}
                  onChange={handleCheckboxChange}
                />
              }
              label="Is Reserved"
            />
          </CardContent>
        </Card>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle><Typography variant="h5">Update Room {formData.room_number}</Typography></DialogTitle>
        <DialogContent>
        <DialogContentText>
        Are you sure you want to update this room?
          </DialogContentText>
          {/* <Typography variant="subtitle1">Are you sure you want to update this room?</Typography> */}
          {/* <Typography variant="body1" sx={{display:'flex',flexDirection:'column'}}>{generateChangeSummary()}</Typography> */}
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position top-right
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Room updated successfully!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
