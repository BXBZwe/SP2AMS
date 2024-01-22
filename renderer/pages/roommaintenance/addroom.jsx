// import React, { useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Card, CardContent, Box, Typography, TextField, Autocomplete } from '@mui/material';
// import axios from 'axios';

// export default function AddRoom() {
//   const [openDialog, setOpenDialog] = useState(false);

//   const [formData, setFormData] = useState({
//     room_number: "102A",
//     floor: 4,
//     room_type: 'Deluxe',
//     base_rent: 5000,
//     deposit: 10000,
//     statusDetails: {
//       occupancy_status: 'Vacant',
//       is_reserved: true,
//       is_available_for_rent:false,
//       payment_status:'PENDING'
//     }
//   });

//   const status = [{ label: 'Booked' }, { label: 'Not Booked' }];
//   const type = [{ label: 'Studio' }, { label: 'Deluxe' }];
//   const rent = [{ label: 'Available' }, { label: 'Not Available' }];

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleInputChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   const handleAutocompleteChange = (name) => (event, value) => {
//     setFormData({ ...formData, [name]: value ? value.label : '' });
//   };

//   const handleConfirmAdd = async () => {
//     try {
//       // const response = await axios.post('http://localhost:3000/addrooms', formData);
//       // const response = await axios.post(`http://localhost:3000/addrooms/${id}`, formData);
//       // console.log('Response',response.data)
//       setOpenDialog(false);
//       // Handle success (e.g., show a success message, refresh data)
//     } catch (error) {
//       console.error('Error posting room details:', error.message);
//       // Handle error (e.g., show an error message)
//     }
//   };

//   return (
//     <>
//       <Card sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
//         <CardContent sx={{ marginRight: 'auto', marginBottom: '10px' }}>
//           <Typography variant="h4">Add New Room</Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//             Configure New Room Items and Details
//           </Typography>
//         </CardContent>
//         <CardContent>
//           <Button variant="contained" sx={{ width: '110px', marginTop: '15px' }} onClick={handleOpenDialog}>
//             Add
//           </Button>
//         </CardContent>
//       </Card>

//       <Box sx={{ display: 'flex', marginTop: '10px' }}>
//         <Card sx={{ width: '70%', display: 'flex', marginBottom: '5px' }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ marginBottom: 2 }}>
//               Enter Room Details
//             </Typography>

//             {/* Room Details Form Fields */}
//             <TextField label="Floor" variant="outlined" fullWidth margin="dense" name="floor" onChange={handleInputChange} />
//             <TextField label="Room Number" variant="outlined" fullWidth margin="dense" name="roomNumber" onChange={handleInputChange} />
//             <TextField label="Deposit" variant="outlined" fullWidth margin="dense" name="deposit" onChange={handleInputChange} />
//             <TextField label="Rent" variant="outlined" fullWidth margin="dense" name="rent" onChange={handleInputChange} />
//             <Autocomplete options={type} renderInput={(params) => <TextField {...params} label="Room Type" />} onChange={handleAutocompleteChange('roomType')} />
//             <Autocomplete options={status} renderInput={(params) => <TextField {...params} label="Room Status" />} onChange={handleAutocompleteChange('roomStatus')} />
//             <Autocomplete options={rent} renderInput={(params) => <TextField {...params} label="Rent Status" />} onChange={handleAutocompleteChange('rentStatus')} />
//           </CardContent>
//         </Card>

//         {/* Other UI Components */}
//       </Box>

//       {/* Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Confirm Add</DialogTitle>
//         <DialogContent>
//           <Typography>Do you want to add a new room?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={handleConfirmAdd}>Confirm</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

// import React, { useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Card, CardContent, Box, Typography, TextField, Autocomplete } from '@mui/material';
// import axios from 'axios';

// export default function AddRoom() {
//   const [openDialog, setOpenDialog] = useState(false);

//   const [formData, setFormData] = useState({
//     room_number: '',
//     floor: '',
//     room_type: '',
//     base_rent: '',
//     deposit: '',
//     statusDetails: {
//       occupancy_status: '',
//       is_reserved: false,
//       is_available_for_rent: false,
//       payment_status: '',
//     },
//   });

//   const status = [{ label: 'Booked' }, { label: 'Not Booked' }];
//   const type = [{ label: 'Studio' }, { label: 'Deluxe' }];
//   const rent = [{ label: 'Available' }, { label: 'Not Available' }];

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleInputChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   const handleAutocompleteChange = (name) => (event, value) => {
//     setFormData({ ...formData, [name]: value ? value.label : '' });
//   };

//   const handleConfirmAdd = async () => {
//     try {
//       // Define the API endpoint where you want to send the data
//       const apiUrl = 'http://localhost:3000/addrooms'; // Replace with your actual API endpoint

//       // Send a POST request to your backend
//       const response = await axios.post(apiUrl, formData);

//       // Handle success (e.g., show a success message, refresh data)
//       console.log('Room added successfully:', response.data);

//       // Close the dialog
//       setOpenDialog(false);
//     } catch (error) {
//       console.error('Error posting room details:', error.message);
//       // Handle error (e.g., show an error message)
//     }
//   };

//   return (
//     <>
//       <Card sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
//         <CardContent sx={{ marginRight: 'auto', marginBottom: '10px' }}>
//           <Typography variant="h4">Add New Room</Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//             Configure New Room Items and Details
//           </Typography>
//         </CardContent>
//         <CardContent>
//           <Button variant="contained" sx={{ width: '110px', marginTop: '15px' }} onClick={handleOpenDialog}>
//             Add
//           </Button>
//         </CardContent>
//       </Card>

//       <Box sx={{ display: 'flex', marginTop: '10px' }}>
//         <Card sx={{ width: '70%', display: 'flex', marginBottom: '5px' }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ marginBottom: 2 }}>
//               Enter Room Details
//             </Typography>

//             {/* Room Details Form Fields */}
//             <TextField label="Floor" variant="outlined" fullWidth margin="dense" name="floor" onChange={handleInputChange} />
//             <TextField label="Room Number" variant="outlined" fullWidth margin="dense" name="room_number" onChange={handleInputChange} />
//             <TextField label="Deposit" variant="outlined" fullWidth margin="dense" name="deposit" onChange={handleInputChange} />
//             <TextField label="Rent" variant="outlined" fullWidth margin="dense" name="base_rent" onChange={handleInputChange} />
//             <Autocomplete options={type} renderInput={(params) => <TextField {...params} label="Room Occupancy" />} onChange={handleAutocompleteChange('room_type')} />
//             <Autocomplete options={status} renderInput={(params) => <TextField {...params} label="Payment Status" />} onChange={handleAutocompleteChange('statusDetails.occupancy_status')} />
//             <Autocomplete options={rent} renderInput={(params) => <TextField {...params} label="Rent Status" />} onChange={handleAutocompleteChange('statusDetails.payment_status')} />
//           </CardContent>
//         </Card>

//         {/* Other UI Components */}
//       </Box>

//       {/* Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Confirm Add</DialogTitle>
//         <DialogContent>
//           <Typography>Do you want to add a new room?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={handleConfirmAdd}>Confirm</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Autocomplete,
//   Box,
//   Button,
// } from "@mui/material";
// import axios from "axios";

// export default function AddRoom() {
//   const [formData, setFormData] = useState({
//     room_number: "",
//     floor: "",
//     room_type: "",
//     base_rent: "",
//     deposit: "",
//     statusDetails: {
//       occupancy_status: "",
//       is_reserved: false,
//       is_available_for_rent: false,
//       payment_status: "",
//     },
//   });

//   // Define getOptionLabel functions for true and false values
//   const getOptionLabelTrue = () => "True";
//   const getOptionLabelFalse = () => "False";

//   const handleInputChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   const handleAutocompleteChange = (name) => (event, value) => {
//     setFormData({ ...formData, [name]: value || "" });
//   };

//   const handleAddRoom = async () => {
//     try {
//       // Send a POST request to your backend to add the room
//       const response = await axios.post(
//         "http://localhost:3000/addrooms",
//         formData
//       );

//       // Handle success (e.g., show a success message, refresh data)
//       console.log("Room added successfully:", response.data);

//       // Clear the form
//       setFormData({
//         room_number: "",
//         floor: "",
//         room_type: "",
//         base_rent: "",
//         deposit: "",
//         statusDetails: {
//           occupancy_status: "",
//           is_reserved: false,
//           is_available_for_rent: false,
//           payment_status: "",
//         },
//       });
//     } catch (error) {
//       console.error("Error posting room details:", error.message);
//       // Handle error (e.g., show an error message)
//     }
//   };

//   const status = ["Booked", "Not Booked"];
//   const type = ["Studio", "Deluxe"];
//   const paymentStatus = ["PENDING", "OVERDUE"];
//   const is_reserved = [true, false];
//   const is_available_for_rent = [true, false];
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

//             <Autocomplete
//               options={status}
//               renderInput={(params) => (
//                 <TextField {...params} label="Room Occupancy" />
//               )}
//               value={formData.statusDetails.occupancy_status}
//               onChange={(event, value) =>
//                 handleAutocompleteChange("statusDetails.occupancy_status")(
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
//                 handleAutocompleteChange("statusDetails.payment_status")(
//                   event,
//                   value
//                 )
//               }
//             />

//             {/* <Autocomplete
//               options={is_reserved}
//               renderInput={(params) => (
//                 <TextField {...params} label="For Reservation" />
//               )}
//               value={formData.statusDetails.is_reserved}
//               onChange={(event, value) =>
//                 handleAutocompleteChange("statusDetails.is_reserved")(
//                   event,
//                   value
//                 )
//               }
//               getOptionLabel={getOptionLabelTrue} // Use getOptionLabel function
//             />

//             <Autocomplete
//               options={is_available_for_rent}
//               renderInput={(params) => (
//                 <TextField {...params} label="For Rent" />
//               )}
//               value={formData.statusDetails.is_available_for_rent}
//               onChange={(event, value) =>
//                 handleAutocompleteChange("statusDetails.is_available_for_rent")(
//                   event,
//                   value
//                 )
//               }
//               getOptionLabel={getOptionLabelTrue} // Use getOptionLabel function
//             /> */}
//           </CardContent>
//         </Card>
//       </Box>

//       <Box sx={{ marginTop: "10px" }}>
//         <Button variant="contained" onClick={handleAddRoom}>
//           Add Room
//         </Button>
//       </Box>
//     </>
//   );
// }

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

export default function AddRoom() {
  const [formData, setFormData] = useState({
    room_number: 0,
    floor: 0,
    room_type: 'Studio',
    base_rent: 0,
    deposit: 0,
    statusDetails: {
      occupancy_status: "Available",
      is_reserved: false,
      is_available_for_rent: false,
      payment_status: "PENDING",
    },
  });

  console.log(formData);

  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAutocompleteChange = (name) => (event, value) => {
    setFormData({ ...formData, [name]: value || "" });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddRoom = async () => {
    // Validate floor, deposit, and base_rent as float values
    if (
      isNaN(parseFloat(formData.floor)) ||
      isNaN(parseFloat(formData.deposit)) ||
      isNaN(parseFloat(formData.base_rent))
    ) {
      alert("Floor, Deposit, and Base Rent must be valid float values.");
      return;
    }
    // Display a confirmation dialog before adding the room
    handleOpenDialog();
  };

  const status = ["Available", "Unavailable"];
  const type = ["Studio", "Deluxe"];
  const paymentStatus = ["PENDING", "OVERDUE"];
  const is_reserved = [true, false];
  const is_available_for_rent = [true, false];

  const confirmAddRoom = async () => {
    try {
      // Send a POST request to your backend to add the room
      // const response = await axios.post(
      //   "http://localhost:3000/addrooms",
      //   formData
      // );
      const response = await axios.post('http://localhost:3000/addrooms', formData);

      // Handle success (e.g., show a success message, refresh data)
      console.log("Room added successfully:", response.data);

      // Clear the form
      setFormData({
        room_number: '',
        floor: '',
        room_type: '',
        base_rent: '',
        deposit: '',
        statusDetails: {
          occupancy_status: '',
          is_reserved: true,
          is_available_for_rent: true,
          payment_status: '',
        },
      });

      // Close the confirmation dialog
      handleCloseDialog();
    } catch (error) {
      console.error("Error posting room details:", error.message);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
        <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
          <Typography variant="h4">Add New Room</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Configure New Room Items and Details
          </Typography>
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
              label="Floor"
              variant="outlined"
              fullWidth
              margin="dense"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
            />
            <TextField
              label="Room Number"
              variant="outlined"
              fullWidth
              margin="dense"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
            />
            <TextField
              label="Deposit"
              variant="outlined"
              fullWidth
              margin="dense"
              name="deposit"
              value={formData.deposit}
              onChange={handleInputChange}
            />
            <TextField
              label="Rent"
              variant="outlined"
              fullWidth
              margin="dense"
              name="base_rent"
              value={formData.base_rent}
              onChange={handleInputChange}
            />

            <Autocomplete
              options={type}
              renderInput={(params) => (
                <TextField {...params} label="Room Type" />
              )}
              value={formData.room_type}
              onChange={(event, value) =>
                handleAutocompleteChange("room_type")(event, value)
              }
            />

            {/* <Autocomplete
              options={status}
              renderInput={(params) => (
                <TextField {...params} label="Room Occupancy" />
              )}
              value={formData.statusDetails.occupancy_status}
              onChange={(event, value) =>
                handleAutocompleteChange('statusDetails.occupancy_status')(
                  event,
                  value
                )
              }
            />

            <Autocomplete
              options={paymentStatus}
              renderInput={(params) => (
                <TextField {...params} label="Payment Status" />
              )}
              value={formData.statusDetails.payment_status}
              onChange={(event, value) =>
                handleAutocompleteChange('statusDetails.payment_status')(
                  event,
                  value
                )
              }
            /> */}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ marginTop: "10px" }}>
        <Button variant="contained" onClick={handleAddRoom}>
          Add Room
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Add</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to add a new room with the following details?
          </DialogContentText>
          <Typography variant="body2">
            Room Number: {formData.room_number}
          </Typography>
          <Typography variant="body2">Floor: {formData.floor}</Typography>
          <Typography variant="body2">
            Room Type: {formData.room_type}
          </Typography>
          <Typography variant="body2">
            Base Rent: {formData.base_rent}
          </Typography>
          <Typography variant="body2">Deposit: {formData.deposit}</Typography>
          {/* <Typography variant="body2">
            Occupancy: {formData.statusDetails.occupancy_status}
          </Typography>
          <Typography variant="body2">
            Is reserved: {formData.statusDetails.is_reserved}
          </Typography>
          <Typography variant="body2">
            For Rent: {formData.statusDetails.is_available_for_rent}
          </Typography>
          <Typography variant="body2">
            Payment: {formData.statusDetails.payment_status}
          </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={confirmAddRoom}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
