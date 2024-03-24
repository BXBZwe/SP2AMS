import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, CardContent, TextField, Select, MenuItem, IconButton, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Typography, Chip, GridOverlay, Box, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ReactComponent as EmptyTableSvg } from "../../public/assets/empty-table.svg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAPI } from "./apiContent";

export default function ratetable() {
  const { rooms, fetchRooms, refreshRooms } = useAPI();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);
  const theme = useTheme();

  // const [rooms, setRooms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [roomToDelete, setRoomToDelete] = useState(null);

  const paymentStatusColors = {
    Null:'default',
    PENDING: "default", 
    OVERDUE: "error", 
    PARTIAL: "warning", 
    PAID: "success", 
  };
  const occupancyFilterOptions = [
    { label: "All", value: "all" },
    { label: "Occupied", value: "OCCUPIED" },
    { label: "Unavailable", value: "UNAVAILABLE" },
    { label: "Vacant", value: "VACANT" },
  ];

  const columns = [
    { field: "room_number", headerName: "Room Number", flex:0.12 },
    { field: "floor", headerName: "Floor", flex:0.12 },
    { field: "room_type", headerName: "Room Type", flex:0.15 },
    {
      field: "occupancy_status",
      headerName: "Occupancy",
      flex:0.15,
      renderCell: (params) => {
        // Accessing occupancy_status from the nested statusDetails object
        return params.row.statusDetails.occupancy_status;
      },
    },
    {
      field: "is_reserved",
      headerName: "Reservation",
      flex:0.12,
      renderCell: (params) => {
        // Accessing is_reserved from the nested statusDetails object
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {params.row.statusDetails.is_reserved ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
          </Box>
        );
      },
    },
    {
      field: "paymentstatus",
      headerName: "Payment",
      flex:0.15,
      renderCell: (params) => {
        const color = paymentStatusColors[params.row.paymentStatus] || "default"; // Assuming paymentStatusColors is a predefined object mapping statuses to colors
        return (
          <Chip
            label={params.row.paymentStatus}
            color={color}
            size="small"
            variant="outlined"
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex:0.13,
      renderCell: (params) => {
        // Assuming the room ID is stored in the row data under a property named 'room_id'
        const roomId = params.row.room_id;
        return (
          <>
            <Link href={`/roommaintenance/editroom?roomId=${roomId}`} passHref>
              <IconButton component="a">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleDeleteClick = (roomId) => {
    // Find the room with the given ID
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      setRoomToDelete(room.room_number); // Set the room number to be displayed in the dialog
      setDeleteRoomId(room.room_id);
      setOpenDeleteDialog(true);
    }
  };

  // console.log('Fetched Rooms',rooms)
  const handleConfirmDelete = async () => {
    // console.log('roomId: ',deleteRoomId)
    if (deleteRoomId) {
      try {
        await axios.delete(`http://localhost:3000/deleterooms/${deleteRoomId}`);
        setSnackbarOpen(true);
        // setRooms(rooms.filter((room) => room.id !== deleteRoomId));
        await refreshRooms();
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

  // const filteredRows = rooms.filter((row) => {
  //   return (
  //     row.roomnumber.toLowerCase().includes(searchText.toLowerCase()) &&
  //     (filterValue === "all" || row.occupancystatus === filterValue)
  //   );
  // });

  const filteredRows = rooms.filter((row) => {
    const matchesSearchText = row.room_number.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilterValue = filterValue === "all" || row.statusDetails.occupancy_status === filterValue;
    return matchesSearchText && matchesFilterValue;
  });

  const CustomNoRowsOverlay = () => (
    <GridOverlay>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <EmptyTableSvg />
        <Typography>No data available</Typography>
      </div>
    </GridOverlay>
  );

  return (
    <>
      <Card sx={{ width: "100%", display: "flex" }}>
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
            <Button variant="contained" sx={{ width: "110px", marginTop: "15px" }} component="a">
              Add
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{ width: "100%", overflow: "hidden", marginTop: "10px" }}>
        <CardContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <TextField label="Search by Room Number" variant="outlined" value={searchText} onChange={(e) => setSearchText(e.target.value)} sx={{ marginRight: "5px", width: "80%" }} />
            <FormControl sx={{ minWidth: '20%' }}>
              <InputLabel id="occupancy-filter-label">Occupancy Filter</InputLabel>
              <Select labelId="occupancy-filter-label" id="occupancy-filter-select" value={filterValue} label="Occupancy Filter" onChange={(e) => setFilterValue(e.target.value)}>
                {occupancyFilterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <DataGrid
          id= "room-data-grid"
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            sx={{
              "& .MuiDataGrid-main": { maxHeight: "70vh" }, // Adjust based on your layout
            }}
            autoHeight
            density="compact"
          />
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}

      <Dialog fullScreen={fullScreen} open={openDeleteDialog} onClose={handleCloseDeleteDialog} aria-labelledby="delete-confirm">
        <DialogTitle id="delete-confirm">{`Delete Room ${roomToDelete}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Once deleted the process cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" autoFocus onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} autoFocus>
            Confirm Delete
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
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Room {roomToDelete} deleted successfully!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
