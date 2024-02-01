import React, { useState } from 'react';
import Head from 'next/head';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function Feedback() {
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);

  const handleAddClick = () => {
    setAddPopupOpen(true);
  };

  const handleCancelClick = () => {
    setAddPopupOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'Room ID', width: 170 },
    { field: 'roomnumber', headerName: 'Room Number', width: 170 },
    {
      field: 'roomfeedback',
      headerName: 'Room Feedback',
      width: 175,
    },
    {
      field: 'issuedate',
      headerName: 'Issue Date',
      width: 170,
    },
    {
      field: 'resolveddate',
      headerName: 'Resolved Date',
      width: 170,
    },
  ];

  const rows = [
    { id: 'A001', roomnumber: '101', roomfeedback: 'Urgent', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A002', roomnumber: '102', roomfeedback: 'Urgent', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A003', roomnumber: '103', roomfeedback: 'Normal', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A004', roomnumber: '104', roomfeedback: 'OK', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A005', roomnumber: '105', roomfeedback: 'Urgent', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A006', roomnumber: '106', roomfeedback: 'Urgent', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A007', roomnumber: '107', roomfeedback: 'Urgent', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A008', roomnumber: '108', roomfeedback: 'Urgent', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
    { id: 'A009', roomnumber: '109', roomfeedback: 'Urgent', issuedate: '23/01/2023', resolveddate: '01/23/2024' },
  ];

  return (
    <div>
      <Head>
        <title>Feedback</title>
      </Head>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Request History</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            A vertically stacked set of interactive headings that each reveal an associated section of content.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </CardContent>
        <CardContent sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            sx={{ width: "100px", marginTop: '15px', marginRight: '10px' }}
            onClick={handleAddClick}
          >
            Add
          </Button>
          <Button variant="contained" sx={{ width: "100px", marginTop: '15px', marginRight: '10px' }}>
            Resolved
          </Button>
          <Button variant="contained" sx={{ width: "100px", marginTop: '15px', marginRight: '10px' }}>
            Delete
          </Button>
        </CardContent>
      </Card>

      
      <Dialog open={isAddPopupOpen} onClose={handleCancelClick}>
        <DialogTitle>Add Feedback</DialogTitle>
        <DialogContent>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}
