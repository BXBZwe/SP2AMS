import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Correctly import axios
import Head from 'next/head';
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { GridActionsCellItem } from '@mui/x-data-grid';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function Feedback() {
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const [room, setRoom] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formValidation, setFormValidation] = useState({
    roomValid: true,
    statusValid: true,
    descriptionValid: true,
    issueDateValid: true,
    additionalStatusValid: true,
  });
  const [issueDate, setIssueDate] = useState('');
  const [additionalStatus, setAdditionalStatus] = useState('');

  

 
  
  

  const handleAddClick = () => {
    setAddPopupOpen(true);
  };

  const handleCancelClick = () => {
    setAddPopupOpen(false);
    resetFormFields();
  };

  const resetFormFields = () => {
    setRoom('');
    setStatus('');
    setDescription('');
    setIssueDate('');
    setAdditionalStatus('');
    setFormValidation({
      roomValid: true,
      statusValid: true,
      descriptionValid: true,
      issueDateValid: true,
      additionalStatusValid: true,
    });
  };

  const handleConfirmClick = () => {
    const roomValid = !!room;
    const statusValid = !!status;
    const descriptionValid = !!description.trim();
    const issueDateValid = !!issueDate;
    const additionalStatusValid = !!additionalStatus;

    setFormValidation({ roomValid, statusValid, descriptionValid, issueDateValid, additionalStatusValid });

    if (roomValid && statusValid && descriptionValid && issueDateValid && additionalStatusValid) {
      
    }
    
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'roomnumber', headerName: 'Room Number', width: 130 },
    { field: 'roomfeedback', headerName: 'Feedback', width: 200 },
    { field: 'issuedate', headerName: 'Issue Date', width: 130 },
    { field: 'resolveddate', headerName: 'Resolved Date', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem icon={<Edit />} label="Edit" onClick={() => console.log('Edit action for', params.id)} />,
        <GridActionsCellItem icon={<Delete />} label="Delete" onClick={() => console.log('Delete action for', params.id)} />,
      ],
    },
  ];

return (
  <div>
    <Head>
      <title>Feedback</title>
    </Head>
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Card sx={{ width: '100%', display: 'flex' }}>
          <CardContent
            sx={{
              marginRight: "auto",
              marginBottom: "10px",
            }}
          >
            <Typography variant="h4">Request History</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              View and manage feedback requests.
            </Typography>
          </CardContent>
          <CardContent sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ width: "100px", marginTop: '15px', marginRight: '10px' }}
              onClick={handleAddClick}
            >
              Add
            </Button>
          </CardContent>
        </Card>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
          />
        </div>
      </CardContent>
    </Card>
    <Dialog open={isAddPopupOpen} onClose={handleCancelClick}>
      <DialogTitle>Add Feedback</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" error={!formValidation.roomValid}>
          <InputLabel id="room-select-label">Room</InputLabel>
          <Select
            labelId="room-select-label"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>{`Room ${room.id}`}</MenuItem>
            ))}
          </Select>
          {!formValidation.roomValid && <FormHelperText>This field is required.</FormHelperText>}
        </FormControl>
        <FormControl fullWidth margin="dense" error={!formValidation.statusValid}>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="URGENT">Urgent</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MODERATE">Moderate</MenuItem>
            <MenuItem value="NORMAL">Normal</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>

            {/* Add more options as needed */}
          </Select>
          {!formValidation.statusValid && <FormHelperText>This field is required.</FormHelperText>}
        </FormControl>
        <TextField
          fullWidth
          margin="dense"
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!formValidation.descriptionValid}
          helperText={!formValidation.descriptionValid ? "This field is required." : ""}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Issue Date"
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          error={!formValidation.issueDateValid}
          helperText={!formValidation.issueDateValid ? "This field is required." : ""}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="dense" error={!formValidation.additionalStatusValid}>
          <InputLabel id="additional-status-select-label">Additional Status</InputLabel>
          <Select
            labelId="additional-status-select-label"
            value={additionalStatus}
            onChange={(e) => setAdditionalStatus(e.target.value)}
          >
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            {/* Add more options as needed */}
          </Select>
          {!formValidation.additionalStatusValid && <FormHelperText>This field is required.</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <Button onClick={handleConfirmClick}>Confirm</Button>
      </DialogActions>
    </Dialog>
  </div>
);

}
