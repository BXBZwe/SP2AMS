import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';

export default function EditRate() {
  const [isEditing, setIsEditing] = useState(false);

  const status = [
    { label: 'Booked' },
    { label: 'Not Booked' },
  ];
  const type = [
    { label: 'Studio' },
    { label: 'Wifi' },
    { label: 'Studio' },
  ];
  const rent = [
    { label: 'Available' },
    { label: 'Not Available' },
  ];
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const columns = [
    { field: 'id', headerName: 'Item ID', width: 130 },
    { field: 'itemid', headerName: 'Item Name', width: 160 },
    {
      field: 'fee',
      headerName: 'Fee',
      type: 'number',
      width: 100,
    },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset values to default or fetch them from the server
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Implement the logic to save changes
  };

  return (
    <>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent
          sx={{
            marginRight: 'auto',
            marginBottom: '10px',
          }}
        >
          <Typography variant="h4">Edit Added Items</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Change or Edit Items.
          </Typography>
        </CardContent>
        <CardContent>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                sx={{ width: '100px', marginTop: '15px', marginRight: '10px' }}
                onClick={handleSaveClick}
              >
                Save
              </Button>
              <Button
                variant="contained"
                sx={{ width: '100px', marginTop: '15px' }}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{ width: '100px', marginTop: '15px' }}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </CardContent>
      </Card>
      <Card sx={{marginTop: '10px',  width: '100%', marginBottom: '10px', display: 'flex' }}>
        <CardContent sx={{ display: 'inline-block' }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Select Room/Tenant
          </Typography>
          <TextField
            id="outlined-basic"
            label="Item Name"
            variant="outlined"
            sx={{ width: '100%', marginBottom: 1.5, marginRight: 5, display: 'inline-block' }}
            disabled={!isEditing}
          />
          <br></br>
          <TextField
            id="outlined-basic"
            label="Item Price"
            variant="outlined"
            sx={{ width: '100%', marginBottom: 1.5, marginRight: 5, display: 'inline-block' }}
            disabled={!isEditing}
          />
          <br></br>
          <TextField
            id="outlined-basic"
            label="Item Ranking"
            variant="outlined"
            sx={{ width: '100%', marginBottom: 1.5, marginRight: 5, display: 'inline-block' }}
            disabled={!isEditing}
          />
        </CardContent>
        <CardContent sx={{ marginTop: 5.5 }}>
          <Typography sx={{ display: 'inline-block', marginLeft: 10 }}>
            <b>VAT</b>
            <Checkbox
              {...label}
              defaultChecked
              sx={{ marginLeft: 5 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Add VAT 7% to Price</span>
            <br></br>
            <b>Payment</b>
            <Checkbox
              {...label}
              defaultChecked
              sx={{ marginLeft: 0.7 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Billing After Usage</span>
            <br></br>
            <b>Meter</b>
            <Checkbox
              {...label}
              defaultChecked
              sx={{ marginLeft: 3.3 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Calculate from Meter</span>
            <br></br>
            <b>Bill</b>
            <Checkbox
              {...label}
              defaultChecked
              sx={{ marginLeft: 5.8 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Show Month on Bill</span>
            <br></br>
            <b>Usage</b>
            <Checkbox
              {...label}
              defaultChecked
              sx={{ marginLeft: 2.9 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Not Use Item</span> <br></br>
          </Typography>
          <br></br>
        </CardContent>
      </Card>
    </>
  );
}
