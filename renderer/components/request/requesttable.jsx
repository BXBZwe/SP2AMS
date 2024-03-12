
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, CardContent, TextField, Select, MenuItem, IconButton, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Typography, Chip, GridOverlay, FormControl, InputLabel, Box, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
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
import React, { useState, useEffect, useMemo } from "react";

export default function RequestTable() {
  const theme = useTheme();
  const [searchRoomText, setSearchRoomText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openupdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    room_id: "",
    request_details: "",
    Request_priority: "",
    Request_status: "UNRESOLVED",
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const priorityOptions = [
    { label: "URGENT", value: "URGENT" },
    { label: "HIGH", value: "HIGH" },
    { label: "MODERATE", value: "MODERATE" },
    { label: "NORMAL", value: "NORMAL" },
    { label: "LOW", value: "LOW" },
  ];

  const priorityColors = {
    URGENT: "error",
    HIGH: "warning",
    MODERATE: "info",
    NORMAL: "success",
    LOW: "default",
  };

  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrequests");
        // Directly setting the entire response data to state
        // console.log(response.data.getRequests);
        setRequests(response.data.getRequests);
      } catch (error) {
        console.error("Error fetching requests:", error.message);
      }
    };
    fetchRequests();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const dateObj = new Date(dateStr);
    return dateObj.toISOString().split("T")[0]; // Splits the ISO string at 'T' and takes the first part (date)
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        setAvailableRooms(response.data.getrooms);
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
      }
    };
    fetchRooms();
  }, []);
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesRoomNumber = searchRoomText ? request.roomBaseDetails.room_number.toLowerCase().includes(searchRoomText.toLowerCase()) : true;
      const matchesPriority = priorityFilter ? request.Request_priority === priorityFilter : true;
      return matchesRoomNumber && matchesPriority;
    });
  }, [requests, searchRoomText, priorityFilter]);
  
  
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setNewRequestData({
      request_id: "",
      room_id: "",
      request_details: "",
      Request_priority: "",
      Request_status: "",
    });
    setIsResolved(false);
  };

  const handleAddRequest = async () => {
    try {
      const response = await axios.post("http://localhost:3000/addrequest", newRequestData);
      setOpenAddDialog(false);

      const roomDetails = availableRooms.find((room) => room.room_id === newRequestData.room_id);

      setSnackbarInfo({
        open: true,
        message: `Request for Room: ${roomDetails.room_number} added successfully!`,
        severity: "success",
      });

      const newRequestWithDetails = {
        ...response.data.data,
        roomBaseDetails: {
          room_id: newRequestData.room_id,
          room_number: roomDetails ? roomDetails.room_number : "N/A",
        },
      };

      setRequests((prevRequests) => [...prevRequests, newRequestWithDetails]);

      setNewRequestData({
        room_id: "",
        request_details: "",
        Request_priority: "",
        Request_status: "UNRESOLVED",
      });
    } catch (error) {
      console.error("Error adding request:", error.message);
    }
  };

  const columns = [
    {
      field: "room_number",
      headerName: "Room Number",
      width: '200',
      valueGetter: (params) => params.row.roomBaseDetails.room_number,
    },
    {
      field: "issue_date",
      headerName: "Issue Date",
      width: '180',
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "Request_priority",
      headerName: "Priority",
      width: '220',
      renderCell: (params) => {
        const color = priorityColors[params.value] || "default";
        return (
          <Chip
            label={params.value}
            color={color}
            size="small"
            variant="outlined"
            style={{
              width: "80%", // set the width to 100% to fill the cell
              justifyContent: "center", // center the text inside the chip
            }}
          />
        );
      },
    },
    {
      field: "Request_status",
      headerName: "Request Status",
      width: '200',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {params.value === "RESOLVED" ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
          </Box>
        );
      },
    },
    {
      field: "resolved_date",
      headerName: "Resolved Date",
      width: '200',
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: '150',
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton onClick={() => handleDeleteClick(params.row.request_id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEditClick = (requestData) => {
    setNewRequestData({
      request_id: requestData.request_id,
      room_id: requestData.room_id,
      request_details: requestData.request_details,
      Request_priority: requestData.Request_priority,
      Request_status: requestData.Request_status,
    });
    setIsResolved(requestData.Request_status === "RESOLVED");
    setOpenUpdateDialog(true);
  };

  const handleUpdateRequest = async () => {
    const updatedData = {
      ...newRequestData,
      Request_status: isResolved ? "RESOLVED" : "UNRESOLVED",
      // Set 'resolved_date' to the current date and time in ISO format when resolved
      resolved_date: isResolved ? new Date().toISOString() : null,
    };

    try {
      await axios.put(`http://localhost:3000/updaterequest/${newRequestData.request_id}`, updatedData);
      setOpenUpdateDialog(false);
      setSnackbarInfo({
        open: true,
        message: `Request ID: ${newRequestData.request_id} updated successfully!`,
        severity: "success",
      });

      // Refresh the data grid with updated requests list
      const response = await axios.get("http://localhost:3000/getallrequests");
      setRequests(response.data.getRequests);

      // Reset the form state
      setNewRequestData({
        room_id: "",
        request_details: "",
        Request_priority: "",
        Request_status: "UNRESOLVED",
      });
      setIsResolved(false); // Ensure isResolved is reset for the next use of the form
    } catch (error) {
      console.error("Error updating request:", error.message);
    }
  };

  const handleDeleteClick = (requestId) => {
    const request = requests.find((request) => request.request_id === requestId);
    if (request) {
      setRequestToDelete(request.roomBaseDetails.room_number);
      setDeleteRequestId(request.request_id);
      setOpenDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteRequestId) {
      try {
        await axios.delete(`http://localhost:3000/deleterequest/${deleteRequestId}`);
        setSnackbarInfo({
          open: true,
          message: `Request ID: ${deleteRequestId} deleted successfully!`,
          severity: "success",
        });
        setRequests((prevRequests) => prevRequests.filter((request) => request.request_id !== deleteRequestId));
      } catch (error) {
        console.error(`Error deleting request with ID: ${deleteRequestId}`, error);
      } finally {
        // Ensure the dialog is closed and the deleteRequestId is reset regardless of success or failure
        setOpenDeleteDialog(false);
        setDeleteRequestId(null);
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteRequestId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarInfo({
      open: false,
    });
  };

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
          <Typography variant="h4">Request Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Manage tenants requests
          </Typography>
        </CardContent>
        <CardContent>
          <Button variant="contained" sx={{ width: "110px", marginTop: "15px" }} onClick={handleOpenAddDialog}>
            Add
          </Button>
        </CardContent>
      </Card>

     <Card sx={{ width: "100%", overflow: "hidden", marginTop: "10px" }}>
      <CardContent>
      <Box sx={{ display: 'flex', marginBottom: 2 }}>
          <TextField
            label="Search by Room Number"
            variant="outlined"
            value={searchRoomText}
            onChange={(e) => setSearchRoomText(e.target.value)}
            sx={{  marginRight: "10px", width: "80%"}}
          />
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel>Priority Filter</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority Filter"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <DataGrid
          rows={filteredRequests}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row.request_id}
          sx={{
            "& .MuiDataGrid-main": { maxHeight: "70vh" },
          }}
          autoHeight
          density="compact"
        />
        </CardContent>
      </Card>
          
      {/* Delete Dialog */}

      <Dialog fullScreen={fullScreen} open={openDeleteDialog} onClose={handleCloseDeleteDialog} aria-labelledby="delete-confirm">
        <DialogTitle id="delete-confirm">{`Delete Room ${requestToDelete}`}</DialogTitle>
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
      {/* Add Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px", // Set the max width you want
            maxHeight: "80vh", // Set the max height you want
            width: "100%", // Use 100% width up to the maxWidth
          },
        }}
      >
        <DialogTitle>Add New Request</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Autocomplete
              sx={{ marginRight: "10px" }}
              fullWidth
              options={availableRooms}
              getOptionLabel={(option) => option.room_number}
              value={availableRooms.find((room) => room.room_id === newRequestData.room_id) || null}
              onChange={(event, newValue) => {
                setNewRequestData({
                  ...newRequestData,
                  room_id: newValue ? newValue.room_id : "",
                });
              }}
              renderInput={(params) => <TextField {...params} label="Select Room" />}
            />

            <Autocomplete
              fullWidth
              options={priorityOptions}
              getOptionLabel={(option) => option.label}
              value={priorityOptions.find((option) => option.value === newRequestData.Request_priority) || null}
              onChange={(event, newValue) => {
                setNewRequestData({
                  ...newRequestData,
                  Request_priority: newValue ? newValue.value : "",
                });
              }}
              renderInput={(params) => <TextField {...params} label="Request Priority" variant="outlined" />}
            />
          </Box>

          <TextField
            fullWidth
            label="Request Details"
            multiline
            rows={4} // Adjust the number of rows as needed
            value={newRequestData.request_details}
            onChange={(e) =>
              setNewRequestData({
                ...newRequestData,
                request_details: e.target.value,
              })
            }
            variant="outlined" // Optional: for a consistent look
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddRequest}>Add Request</Button>
        </DialogActions>
      </Dialog>
      {/* Update Dialog */}
      <Dialog
        open={openupdateDialog}
        onClose={handleCloseUpdateDialog}
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px", // Set the max width you want
            maxHeight: "80vh", // Set the max height you want
            width: "100%", // Use 100% width up to the maxWidth
          },
        }}
      >
        <DialogTitle>Update Request</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Autocomplete
              sx={{ marginRight: "10px" }}
              fullWidth
              options={availableRooms}
              getOptionLabel={(option) => option.room_number}
              value={availableRooms.find((room) => room.room_id === newRequestData.room_id) || null}
              onChange={(event, newValue) => {
                setNewRequestData({
                  ...newRequestData,
                  room_id: newValue ? newValue.room_id : "",
                });
              }}
              renderInput={(params) => <TextField {...params} label="Select Room" />}
            />

            <Autocomplete
              fullWidth
              options={priorityOptions}
              getOptionLabel={(option) => option.label}
              value={priorityOptions.find((option) => option.value === newRequestData.Request_priority) || null}
              onChange={(event, newValue) => {
                setNewRequestData({
                  ...newRequestData,
                  Request_priority: newValue ? newValue.value : "",
                });
              }}
              renderInput={(params) => <TextField {...params} label="Request Priority" variant="outlined" />}
            />
          </Box>

          <TextField
            fullWidth
            label="Request Details"
            multiline
            rows={4} // Adjust the number of rows as needed
            value={newRequestData.request_details}
            onChange={(e) =>
              setNewRequestData({
                ...newRequestData,
                request_details: e.target.value,
              })
            }
            variant="outlined" // Optional: for a consistent look
          />
          <FormControlLabel control={<Checkbox checked={isResolved} onChange={(e) => setIsResolved(e.target.checked)} />} label="Mark as Resolved" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdateRequest}>Update Request</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={4000}
        onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position top-right
      >
        <MuiAlert onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })} severity={snackbarInfo.severity} sx={{ width: "100%" }}>
          {snackbarInfo.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
