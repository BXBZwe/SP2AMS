import React, { useState } from "react";
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
} from "@mui/material";
import axios from "axios";

export default function AddRoom() {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert 'floor' to an integer
    const updatedFormData = {
      ...formData,
      floor: parseInt(formData.floor, 10) || 0, // Convert to integer, default to 0 if NaN
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/addrooms",
        updatedFormData
      );
      console.log("Room added successfully:", response.data);
      // Reset the form or handle success as needed
    } catch (error) {
      console.error("Error adding room:", error);
      // Handle error
    }
  };

  const occupancyOptions = ["Vacant", "Occupied", "Unavailable"];
  const paymentOptions = ["PENDING", "OVERDUE", "PARTIAL", "PAID"];

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Add New Room</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Configure New Room Details
          </Typography>
        </CardContent>
        <CardContent>
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "110px", marginTop: "15px" }}
            onClick={handleSubmit}
          >
            Add Room
          </Button>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, margin: 2 }}
        >
          <TextField
            label="Room Number"
            name="room_number"
            value={formData.room_number}
            onChange={handleInputChange}
          />
          <TextField
            label="Floor"
            name="floor"
            type="number"
            value={formData.floor}
            onChange={handleInputChange}
          />
          <TextField
            label="Room Type"
            name="room_type"
            value={formData.room_type}
            onChange={handleInputChange}
          />
          <TextField
            label="Base Rent"
            name="base_rent"
            type="number"
            value={formData.base_rent}
            onChange={handleInputChange}
          />
          <TextField
            label="Deposit"
            name="deposit"
            type="number"
            value={formData.deposit}
            onChange={handleInputChange}
          />

          <Autocomplete
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
          />

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
          {/* <FormControlLabel
            control={
              <Checkbox
                name="statusDetails.is_available_for_rent"
                checked={formData.statusDetails.is_available_for_rent}
                onChange={handleCheckboxChange}
              />
            }
            label="Is Available for Rent"
          /> */}
          <Autocomplete
            options={paymentOptions}
            value={formData.statusDetails.payment_status}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                statusDetails: {
                  ...formData.statusDetails,
                  payment_status: newValue,
                },
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Payment Status" />
            )}
          />
          {/* <TextField
            label="Payment Status"
            name="statusDetails.payment_status"
            value={formData.statusDetails.payment_status}
            onChange={handleInputChange}
          /> */}
        </Box>
      </form>
    </>
  );
}
