
// import React, { useEffect, useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import Typography from '@mui/material/Typography';
// import { Button, Card, CardContent, IconButton, InputAdornment, TextField, MenuItem, Select } from "@mui/material";
// import Link from 'next/link';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import axios from 'axios';

// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// const columns = [
//   { field: 'id', headerName: 'Room ID', width: 130 },
//   { field: 'roomnumber', headerName: 'Room Number', width: 170 },
//   { field: 'floor', headerName: 'Floor', width: 150 },
//   { field: 'roomtype', headerName: 'Room Type', width: 170 },
//   { field: 'roomstatus', headerName: 'Room Status', width: 150 },
  
//   { field: 'startdate', headerName: 'Contract Start Date', width: 170 },
//   { field: 'enddate', headerName: 'End Date', width: 130 },
  
//   {
//     field: 'action',
//     headerName: 'Action',
//     width: 150,
//     renderCell: (params) => (
//       <div>
//         <Link href="roommaintenance/addroom" passHref>
//           <IconButton onClick={() => handleEdit(params.row.id)}>
//             <EditIcon />
//           </IconButton>
//         </Link>
//         <IconButton onClick={() => handleDelete(params.row.id)}>
//           <DeleteIcon />
//         </IconButton>
//       </div>
//     ),
//   },
// ];

// const rows = [
//   { id: 'A001', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A002', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A003', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A004', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A005', roomnumber: 'A001', floor: '1', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
//   { id: 'A006', roomnumber: 'A001', floor: '2', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A007', roomnumber: 'A001', floor: '2', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
//   { id: 'A008', roomnumber: 'A001', floor: '2', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
//   { id: 'A009', roomnumber: 'A001', floor: '2', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
// ];

// const handleEdit = (roomId) => {
//   // Implement the edit logic here
//   console.log(`Edit room with ID ${roomId}`);
// };

// const handleDelete = (roomId) => {
//   // Implement the delete logic here
//   console.log(`Delete room with ID ${roomId}`);
// };

// export default function ratetable() {
//   const [searchText, setSearchText] = React.useState('');
//   const [filterValue, setFilterValue] = React.useState('all');
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/getallrooms');
//         const roomsData = response.data;
    
//           setRooms(roomsData.getrooms);
  
//       } catch (error) {
//         console.error('Error fetching rooms:', error.message);
//       }
//     };
  
//     fetchRooms();
//   }, []);
  
//   console.log('Fetched Data',rooms[0]);
//   console.log('Rows',rows[0]);

//   // const filteredRows = React.useMemo(() => {
//   //   return rows.filter(row => (
//   //     row.roomnumber.toLowerCase().includes(searchText.toLowerCase()) ||
//   //     row.apartment.toLowerCase().includes(searchText.toLowerCase()) ||
//   //     row.roomstatus.toLowerCase().includes(searchText.toLowerCase())
//   //   ) && (filterValue === 'all' || row.roomstatus === filterValue)
//   //   );
//   // }, [searchText, filterValue]);

//   const filteredRows = React.useMemo(() => {
//     return rooms.filter(row => (
//       row.room_number.toLowerCase().includes(searchText.toLowerCase()) ||
//       row.room_type.toLowerCase().includes(searchText.toLowerCase()) ||
//       row.roomstatus.toLowerCase().includes(searchText.toLowerCase())
//     ) && (filterValue === 'all' || row.roomstatus === filterValue)
//     );
//   }, [searchText, filterValue]);


//   return (
//     <>
//       <Card sx={{ width: '100%', display: 'flex' }}>
//         <CardContent
//           sx={{
//             marginRight: "auto",
//             marginBottom: "10px",
//           }}
//         >
//           <Typography variant="h4">Room Maintenance</Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//             Remove or Relocate tenants corresponding to their room settings
//           </Typography>
//         </CardContent>
//         <CardContent>
//           <Link href="roommaintenance/addroom" passHref>
//             <Button
//               variant="contained"
//               sx={{ width: "60px", marginTop: '15px' }}
//               component="a"
//             >
//               Add
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//       <Card sx={{  marginTop: '10px' }}>
//         <CardContent >
//         <div style={{ display: 'flex', marginBottom: '10px' }}>
//           <TextField
//             label="Search"
//             variant="outlined"
//             fullWidth
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
            
//             sx={{ marginRight: '10px', width: '80%' }}
//           />
//           <Select
//             value={filterValue}
//             onChange={(e) => setFilterValue(e.target.value)}
//             displayEmpty
//             inputProps={{ 'aria-label': 'Filter' }}
//             sx={{width: '20%'}}
            
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="Available">Available</MenuItem>
//             <MenuItem value="Occupied">Occupied</MenuItem>
//           </Select></div>
//           <div style={{ height: '89%', width: '100%' }}>
//             <DataGrid
//               rows={filteredRows}
//               columns={columns}
//               pageSize={5}
//               pageSizeOptions={[5, 10]}
//               checkboxSelection
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, CardContent, TextField, Select, MenuItem, IconButton, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Typography,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function ratetable() {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        setRooms(
          response.data.getrooms.map((room) => ({
            id: room.room_id,
            roomnumber: room.room_number,
            floor: room.floor,
            roomtype: room.room_type,
            occupancystatus: room.statusDetails.occupancy_status,
            reservationstatus: room.statusDetails.is_reserved,
            paymentstatus: room.statusDetails.payment_status,
          }))
        );
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
      }
    };
    fetchRooms();
  }, []);

  const columns = [
    { field: "roomnumber", headerName: "Room Number", width: 120 },
    { field: "floor", headerName: "Floor", width: 120 },
    { field: "roomtype", headerName: "Room Type", width: 120 },
    { field: "occupancystatus", headerName: "Occupancy", width: 120 },
    { field: "reservationstatus", headerName: "Reservation", width: 120 },
    { field: "paymentstatus", headerName: "Payment", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <Link
            href={`/roommaintenance/editroom?roomId=${params.row.id}`}
            passHref
          >
            <IconButton component="a">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleDeleteClick = (roomId) => {
    // Find the room with the given ID
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      setRoomToDelete(room.roomnumber); // Set the room number to be displayed in the dialog
      setDeleteRoomId(roomId);
      setOpenDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteRoomId) {
      try {
        await axios.delete(`http://localhost:3000/deleterooms/${deleteRoomId}`);
        setSnackbarOpen(true);
        setRooms(rooms.filter((room) => room.id !== deleteRoomId));
      } catch (error) {
        console.error(`Error deleting room with ID: ${deleteRoomId}`, error);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteRoomId(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteRoomId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredRows = rooms.filter((row) => {
    return (
      row.roomnumber.toLowerCase().includes(searchText.toLowerCase()) &&
      (filterValue === "all" || row.occupancystatus === filterValue)
    );
  });

  return (
    <>
      <Card sx={{ width: "100%", display: "flex" }}>
        {/* CardContent for heading */}
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Room Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            View and manage room settings
          </Typography>
        </CardContent>
        <CardContent>
          <Link href="roommaintenance/addroom" passHref>
            <Button
              variant="contained"
              sx={{ width: "60px", marginTop: "15px" }}
              component="a"
            >
              Add
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Card sx={{ marginTop: "10px" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          pageSizeOptions={[5, 10]}
        />
      </Card>

      {/* Confirmation Dialog */}

      <Dialog
        fullScreen={fullScreen}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-confirm"
      >
        <DialogTitle id="delete-confirm">{`Delete Room ${roomToDelete}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This process will detele the specified room you have selected. Once deleted the process cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            autoFocus
            onClick={handleCloseDeleteDialog}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            autoFocus
          >
            Yes, I want to delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position top-right
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Room deleted successfully!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
