import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Chip,
  GridOverlay,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ReactComponent as EmptyTableSvg } from "../../public/assets/empty-table.svg";

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


  const paymentStatusColors = {
    PENDING: "default", // grey color
    OVERDUE: "error", // red color
    PARTIAL: "warning", // yellow color
    PAID: "success", // green color
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        setRooms(
          response.data.getrooms.map((room) => {
            // Check if generatedBillRecords is not empty and assign the payment_status from the latest record
            const paymentStatus = room.generatedBillRecords.length > 0
              ? room.generatedBillRecords[0].payment_status
              : "Not Available"; // Or any default/fallback status you prefer
  
            return {
              id: room.room_id,
              roomnumber: room.room_number,
              floor: room.floor,
              roomtype: room.room_type,
              occupancystatus: room.statusDetails.occupancy_status,
              reservationstatus: room.statusDetails.is_reserved,
              paymentstatus: paymentStatus, // Use the extracted or default payment status
            };
          })
        );
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
      }
    };
    fetchRooms();
  }, []);

  // console.log("PaymentSTsuts",rooms.paymentStatus);

  const columns = [
    { field: "roomnumber", headerName: "Room Number", flex: 0.14 },
    { field: "floor", headerName: "Floor", flex: 0.14 },
    { field: "roomtype", headerName: "Room Type", flex: 0.14 },
    { field: "occupancystatus", headerName: "Occupancy", flex: 0.14 },
    { field: "reservationstatus", headerName: "Reservation", flex: 0.14 },
    {
      field: "paymentstatus",
      headerName: "Payment",
      flex: 0.16,
      renderCell: (params) => {
        const color =
          paymentStatusColors[params.row.paymentstatus] || "default";
        return (
          <Chip
            label={params.row.paymentstatus}
            color={color}
            size="small"
            variant="outlined"
            style={{
              width: "100%", // set the width to 100% to fill the cell
              justifyContent: "center", // center the text inside the chip
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.14,
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
            <Button
              variant="contained"
              sx={{ width: "110px", marginTop: "15px" }}
              component="a"
            >
              Add
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{ width: "100%", overflow: "hidden", marginTop: "10px" }}>
        {" "}
        {/* Ensure the Card allows for internal scrolling if needed */}
        <DataGrid
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
            Once deleted the process cannot be undone.
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
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Room {roomToDelete} deleted successfully!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
