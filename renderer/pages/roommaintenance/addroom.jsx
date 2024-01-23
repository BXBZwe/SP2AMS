// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Autocomplete,
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import axios from "axios";

// export default function AddRoom() {
//   const [formData, setFormData] = useState({
//     room_number: '',
//     floor: '',
//     room_type: '',
//     base_rent: '',
//     deposit: '',
//     statusDetails: {
//       occupancy_status: '',
//       is_reserved: '',
//       is_available_for_rent: '',
//       payment_status: '',
//     },
//   });

//   console.log(formData);

//   const [openDialog, setOpenDialog] = useState(false);

//   const handleInputChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   const handleAutocompleteChange = (name) => (event, value) => {
//     setFormData({ ...formData, [name]: value || "" });
//   };

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleAddRoom = async () => {
//     // Validate floor, deposit, and base_rent as float values
//     if (
//       isNaN(parseFloat(formData.floor)) ||
//       isNaN(parseFloat(formData.deposit)) ||
//       isNaN(parseFloat(formData.base_rent))
//     ) {
//       alert("Floor, Deposit, and Base Rent must be valid float values.");
//       return;
//     }
//     // Display a confirmation dialog before adding the room
//     handleOpenDialog();
//   };

//   const status = ["Available", "Unavailable"];
//   const type = ["Studio", "Deluxe"];
//   const paymentStatus = ["PENDING", "OVERDUE"];
//   const is_reserved = [true, false];
//   const is_available_for_rent = [true, false];

//   const confirmAddRoom = async () => {
//     try {
//       // Send a POST request to your backend to add the room
//       // const response = await axios.post(
//       //   "http://localhost:3000/addrooms",
//       //   formData
//       // );
//       const response = await axios.post('http://localhost:3000/addrooms', formData);

//       // Handle success (e.g., show a success message, refresh data)
//       console.log("Room added successfully:", response.data);

//       // Clear the form
//       setFormData({
//         room_number: '',
//         floor: '',
//         room_type: '',
//         base_rent: '',
//         deposit: '',
//         statusDetails: {
//           occupancy_status: '',
//           is_reserved: '',
//           is_available_for_rent: '',
//           payment_status: '',
//         },
//       });

//       // Close the confirmation dialog
//       handleCloseDialog();
//     } catch (error) {
//       console.error("Error posting room details:", error.message);
//       // Handle error (e.g., show an error message)
//     }
//   };

//   return (
//     <>
//       <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
//         <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
//           <Typography variant="h4">Add New Room</Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//             Configure New Room Items and Details
//           </Typography>
//         </CardContent>
//       </Card>

//       <Box sx={{ display: "flex", marginTop: "10px" }}>
//         <Card sx={{ width: "70%", display: "flex", marginBottom: "5px" }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ marginBottom: 2 }}>
//               Enter Room Details
//             </Typography>

//             {/* Room Details Form Fields */}
//             <TextField
//               label="Floor"
//               variant="outlined"
//               fullWidth
//               margin="dense"
//               name="floor"
//               value={formData.floor}
//               onChange={handleInputChange}
//             />
//             <TextField
//               label="Room Number"
//               variant="outlined"
//               fullWidth
//               margin="dense"
//               name="room_number"
//               value={formData.room_number}
//               onChange={handleInputChange}
//             />
//             <TextField
//               label="Deposit"
//               variant="outlined"
//               fullWidth
//               margin="dense"
//               name="deposit"
//               value={formData.deposit}
//               onChange={handleInputChange}
//             />
//             <TextField
//               label="Rent"
//               variant="outlined"
//               fullWidth
//               margin="dense"
//               name="base_rent"
//               value={formData.base_rent}
//               onChange={handleInputChange}
//             />

//             <Autocomplete
//               options={type}
//               renderInput={(params) => (
//                 <TextField {...params} label="Room Type" />
//               )}
//               value={formData.room_type}
//               onChange={(event, value) =>
//                 handleAutocompleteChange("room_type")(event, value)
//               }
//             />

//             {/* <Autocomplete
//               options={status}
//               renderInput={(params) => (
//                 <TextField {...params} label="Room Occupancy" />
//               )}
//               value={formData.statusDetails.occupancy_status}
//               onChange={(event, value) =>
//                 handleAutocompleteChange('statusDetails.occupancy_status')(
//                   event,
//                   value
//                 )
//               }
//             />

//             <Autocomplete
//               options={paymentStatus}
//               renderInput={(params) => (
//                 <TextField {...params} label="Payment Status" />
//               )}
//               value={formData.statusDetails.payment_status}
//               onChange={(event, value) =>
//                 handleAutocompleteChange('statusDetails.payment_status')(
//                   event,
//                   value
//                 )
//               }
//             /> */}
//           </CardContent>
//         </Card>
//       </Box>

//       <Box sx={{ marginTop: "10px" }}>
//         <Button variant="contained" onClick={handleAddRoom}>
//           Add Room
//         </Button>
//       </Box>

//       {/* Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Confirm Add</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Do you want to add a new room with the following details?
//           </DialogContentText>
//           <Typography variant="body2">
//             Room Number: {formData.room_number}
//           </Typography>
//           <Typography variant="body2">Floor: {formData.floor}</Typography>
//           <Typography variant="body2">
//             Room Type: {formData.room_type}
//           </Typography>
//           <Typography variant="body2">
//             Base Rent: {formData.base_rent}
//           </Typography>
//           <Typography variant="body2">Deposit: {formData.deposit}</Typography>
//           {/* <Typography variant="body2">
//             Occupancy: {formData.statusDetails.occupancy_status}
//           </Typography>
//           <Typography variant="body2">
//             Is reserved: {formData.statusDetails.is_reserved}
//           </Typography>
//           <Typography variant="body2">
//             For Rent: {formData.statusDetails.is_available_for_rent}
//           </Typography>
//           <Typography variant="body2">
//             Payment: {formData.statusDetails.payment_status}
//           </Typography> */}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={confirmAddRoom}>Confirm</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

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
