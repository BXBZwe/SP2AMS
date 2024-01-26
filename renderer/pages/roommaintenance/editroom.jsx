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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

export default function EditRoom() {
  const router = useRouter();
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
      is_available_for_rent: false,
      payment_status: "",
    },
  });
  const [editable, setEditable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/geteachroom/${roomId}`
        );
        setFormData(response.data.room);
        setRoomNumber(response.data.room.room_number);
      } catch (error) {
        console.error("Error fetching room:", error.message);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

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
    const field = name.split(".")[1];
    setFormData({
      ...formData,
      statusDetails: {
        ...formData.statusDetails,
        [field]: checked,
      },
    });
  };

  const toggleEdit = () => {
    setEditable(!editable);
  };

  const handleSave = () => {
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
      setSnackbarOpen(true);
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
            />
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>Room Type</InputLabel>
              <Select
                disabled={!editable}
                value={formData.room_type}
                label="Room Type"
                onChange={handleSelectChange("room_type")}
              >
                <MenuItem value="Studio">Studio</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
              </Select>
            </FormControl>

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
            {/* <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>For Reservation</InputLabel>
              <Select
                value={formData.statusDetails.is_reserved}
                label="For Reservation"
                onChange={handleSelectChange("statusDetails.is_reserved")}
              >
                {is_reserved.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            {/* <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>For Rent</InputLabel>
              <Select
                value={formData.statusDetails.is_available_for_rent}
                label="For Rent"
                onChange={handleSelectChange("statusDetails.is_available_for_rent")}
              >
                {is_available_for_rent.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </CardContent>
        </Card>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>Do you want to save these changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button onClick={handleConfirmSave} autoFocus>
            Yes
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
