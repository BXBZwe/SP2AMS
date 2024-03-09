import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, CardContent, IconButton, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useAPI } from "./apiContent";


export default function RateTable() {
  const { rates, fetchRates, refreshRates } = useAPI();
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRateId, setDeleteRateId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [rateToDelete, setRateToDelete] = useState(null);


  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const dateObj = new Date(dateStr);
    return dateObj.toISOString().split("T")[0];
  };

  const columns = [
    { field: "item_name", headerName: "Item Name", flex: 1 },
    { field: "item_price", headerName: "Item Price", flex: 1 },
    { field: "item_description", headerName: "Item Description", flex: 1 },
    { field: "last_updated", headerName: "Last Updated", flex: 1 ,valueFormatter: (params) => formatDate(params.value),},
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        const rateId = params.row.rate_id;
        
        return (
          <>
            <Link href={`/ratemaintenance/editrate?rateId=${rateId}`} passHref>
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

  const handleDeleteClick = (rateId) => {
    // Find the rate with the given ID
    const rate = rates.find((rate) => rate.id === rateId);
    if (rate) {
      setRateToDelete(rate.item_name); // Set the item name to be displayed in the dialog
      setDeleteRateId(rate.rate_id);
      setOpenDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteRateId) {
      try {
        await axios.delete(`http://localhost:3000/deleterates/${deleteRateId}`);
        // console.log(deleteRateId);
        setSnackbarOpen(true);
        await refreshRates();
        // setRates(rates.filter((rate) => rate.rate_id !== deleteRateId));
      } catch (error) {
        console.error(`Error deleting rate with ID: ${deleteRateId}`, error);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteRateId(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteRateId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredRows = rates.filter((row) => {
    return (
      row.item_name.toLowerCase().includes(searchText.toLowerCase()) &&
      (filterValue === "all" || row.item_price == filterValue)
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
          <Typography variant="h4">Rate Table</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            View and manage room rates
          </Typography>
        </CardContent>
        <CardContent>
          <Link href="../ratemaintenance/addrate" passHref>
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
        <CardContent>
        <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
          <TextField
          label="Search"
          variant="outlined"
          fullWidth
          
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
            
          </div>
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
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-confirm"
      >
        <DialogTitle id="delete-confirm">{`Delete Rate for ${rateToDelete}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This process will delete the specified rate you have selected. Once
            deleted, the process cannot be undone.
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
          Rate deleted successfully!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
