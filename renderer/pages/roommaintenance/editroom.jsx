// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   Card,
//   CardContent,
//   Box,
//   Typography,
//   TextField,
//   Autocomplete,
// } from "@mui/material";
// import axios from "axios";
// import { useRouter } from "next/router";

// export default function EditRoom() {
//   const router = useRouter();
//   const { roomId } = router.query;
//   // console.log('Specific ',roomId);

//   const [openDialog, setOpenDialog] = useState(false);

//   // const [formData, setFormData] = useState({
//   //   room_number: "102A",
//   //   floor: 4,
//   //   room_type: 'Deluxe',
//   //   base_rent: 5000,
//   //   deposit: 10000,
//   //   statusDetails: {
//   //     occupancy_status: 'Vacant',
//   //     is_reserved: true,
//   //     is_available_for_rent:false,
//   //     payment_status:'PENDING'
//   //   }
//   // });

//   // useEffect(() => {
//   //   const fetchRooms = async () => {
//   //     try {
//   //       const response = await axios.get(`http://localhost:3000/geteachroom/${roomId}`);
//   //       console.log(response.data.room)
//   //       // const roomsData = response.data.getrooms.map(room => ({
//   //       //   id: room.room_id,
//   //       //   roomnumber: room.room_number,
//   //       //   floor: room.floor,
//   //       //   roomtype: room.room_type,
//   //       //   occupancystatus: room.statusDetails.occupancy_status,
//   //       //   reservationstatus: room.statusDetails.is_reserved,
//   //       //   paymentstatus: room.statusDetails.payment_status
//   //       // }));
//   //       // setRooms(roomsData);
//   //     } catch (error) {
//   //       console.error('Error fetching rooms:', error.message);
//   //     }
//   //   };

//   //   fetchRooms();
//   // }, []);

//   const [formData, setFormData] = useState({
//     room_number: "",
//     floor: "",
//     room_type: "",
//     base_rent: "",
//     deposit: "",
//     statusDetails: {
//       occupancy_status: "",
//       is_reserved: "",
//       is_available_for_rent: false,
//       payment_status: "",
//     },
//   });

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/geteachroom/${roomId}`
//         );
//         const roomData = response.data.room;

//         // Update the formData state with the fetched data
//         setFormData(roomData);
//       } catch (error) {
//         console.error("Error fetching room:", error.message);
//       }
//     };

//     fetchRooms();
//   }, [roomId]);

//   const status = [{ label: "Booked" }, { label: "Not Booked" }];
//   const type = [{ label: "Studio" }, { label: "Delux" }];
//   const rent = [{ label: "Available" }, { label: "Not Available" }];

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
//     setFormData({ ...formData, [name]: value ? value.label : "" });
//   };

//   const handleConfirmAdd = async () => {
//     try {
//       // const response = await axios.post('http://localhost:3000/addrooms', formData);
//       // const response = await axios.post(`http://localhost:3000/addrooms/${id}`, formData);
//       // console.log('Response',response.data)
//       setOpenDialog(false);
//       // Handle success (e.g., show a success message, refresh data)
//     } catch (error) {
//       console.error("Error posting room details:", error.message);
//       // Handle error (e.g., show an error message)
//     }
//   };

//   return (
//     <>
//       <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
//         <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
//           <Typography variant="h4">Edit Room {roomId}</Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//             Configure New Room Items and Details
//           </Typography>
//         </CardContent>
//         <CardContent>
//           <Button
//             variant="contained"
//             sx={{ width: "110px", marginTop: "15px" }}
//             onClick={handleOpenDialog}
//           >
//             Edit
//           </Button>
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
//               name="roomNumber"
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
//               name="rent"
//               value={formData.base_rent}
//               onChange={handleInputChange}
//             />
//             <Autocomplete
//               value={formData.room_type}
//               options={type}
//               renderInput={(params) => (
//                 <TextField {...params} label="Room Type" />
//               )}
//               onChange={handleAutocompleteChange("roomType")}
//             />
//             <Autocomplete
//               options={status}
//               value={formData.statusDetails.occupancy_status}
//               renderInput={(params) => (
//                 <TextField {...params} label="Room Occupancy" />
//               )}
//               onChange={handleAutocompleteChange("roomStatus")}
//             />
//             <Autocomplete
//               value={formData.statusDetails.is_reserved}

//               options={rent}
//               renderInput={(params) => (
//                 <TextField {...params} label="For Reservation" />
//               )}
//               onChange={handleAutocompleteChange("rentStatus")}
//             />
//             <Autocomplete
//               value={formData.statusDetails.is_available_for_rent}
//               options={rent}
//               renderInput={(params) => (
//                 <TextField {...params} label="For Rent" />
//               )}
//               onChange={handleAutocompleteChange("rentStatus")}
//             />
//                         <Autocomplete
//               value={formData.statusDetails.payment_status}
//               options={rent}
//               renderInput={(params) => (
//                 <TextField {...params} label="Payment Status" />
//               )}
//               onChange={handleAutocompleteChange("rentStatus")}
//             />
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

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditRoom() {
  const router = useRouter();
  const { roomId } = router.query;

  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    room_number: "",
    floor: "",
    room_type: "",
    base_rent: "",
    deposit: "",
    statusDetails: {
      occupancy_status: "",
      is_reserved: false,
      is_available_for_rent: false,
      payment_status: "",
    },
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/geteachroom/${roomId}`
        );
        const roomData = response.data.room;

        // Update the formData state with the fetched data
        setFormData(roomData);
      } catch (error) {
        console.error("Error fetching room:", error.message);
      }
    };

    fetchRooms();
  }, [roomId]);

  const status = ["Available", "Unavailable"];
  const paymentStatus = ["PENDING", "OVERDUE"];
  const is_reserved = ["true", "false"];
  const is_available_for_rent = ["true", "false"];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCheckboxChange = (name) => (event) => {
    setFormData({ ...formData, [name]: event.target.checked });
  };

  const handleSelectChange = (name) => (event) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleConfirmAdd = async () => {
    try {
      // const response = await axios.post('http://localhost:3000/addrooms', formData);
      // const response = await axios.post(`http://localhost:3000/addrooms/${id}`, formData);
      // console.log('Response',response.data)
      setOpenDialog(false);
      // Handle success (e.g., show a success message, refresh data)
    } catch (error) {
      console.error("Error posting room details:", error.message);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
        <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
          <Typography variant="h4">Edit Room {roomId}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Configure New Room Items and Details
          </Typography>
        </CardContent>
        <CardContent>
          <Button
            variant="contained"
            sx={{ width: "110px", marginTop: "15px" }}
            onClick={handleOpenDialog}
          >
            Edit
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
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>Room Type</InputLabel>
              <Select
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
            <FormControl fullWidth variant="outlined" margin="dense">
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
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="dense">
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
            </FormControl>

          </CardContent>
        </Card>

        {/* Other UI Components */}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Add</DialogTitle>
        <DialogContent>
          <Typography>Do you want to add a new room?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAdd}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
