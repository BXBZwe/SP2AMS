import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, IconButton, InputAdornment, TextField, MenuItem, Select } from "@mui/material";
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { field: 'id', headerName: 'Room ID', width: 130 },
  { field: 'roomnumber', headerName: 'Room Number', width: 170 },
  { field: 'apartment', headerName: 'Apartment', width: 150 },
  { field: 'roomstatus', headerName: 'Room Status', width: 150 },
  { field: 'startdate', headerName: 'Start Date', width: 130 },
  { field: 'enddate', headerName: 'End Date', width: 130 },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    renderCell: (params) => (
      <div>
        <Link href="roommaintenance/addroom" passHref>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
        </Link>
        <IconButton onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  },
];

const rows = [
  { id: 'A001', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A002', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A003', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A004', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A005', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A006', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A007', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A008', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A009', roomnumber: 'A001', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
];

const handleEdit = (roomId) => {
  // Implement the edit logic here
  console.log(`Edit room with ID ${roomId}`);
};

const handleDelete = (roomId) => {
  // Implement the delete logic here
  console.log(`Delete room with ID ${roomId}`);
};

export default function ratetable() {
  const [searchText, setSearchText] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('all');

  const filteredRows = React.useMemo(() => {
    return rows.filter(row => (
      row.roomnumber.toLowerCase().includes(searchText.toLowerCase()) ||
      row.apartment.toLowerCase().includes(searchText.toLowerCase()) ||
      row.roomstatus.toLowerCase().includes(searchText.toLowerCase())
    ) && (filterValue === 'all' || row.roomstatus === filterValue)
    );
  }, [searchText, filterValue]);

  return (
    <>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Room Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Remove or Relocate tenants corresponding to their room settings
          </Typography>
        </CardContent>
        <CardContent>
          <Link href="roommaintenance/addroom" passHref>
            <Button
              variant="contained"
              sx={{ width: "60px", marginTop: '15px' }}
              component="a"
            >
              Add
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            
            sx={{ marginRight: '10px', width: '80%' }}
          />
          <Select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Filter' }}
            sx={{width: '20%'}}
            
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Occupied">Occupied</MenuItem>
          </Select></div>
          <div style={{ height: '89%', width: '100%' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
