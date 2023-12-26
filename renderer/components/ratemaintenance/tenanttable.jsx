import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Card, CardContent, TextField, Select, MenuItem, Button, IconButton } from "@mui/material";
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { field: 'id', headerName: 'Tenant ID', width: 130 },
  { field: 'roomnumber', headerName: 'Room Number', width: 170 },
  { field: 'fullname', headerName: 'Full Name', width: 140 },
  { field: 'phnumber', headerName: 'Phone Number', width: 140 },
  { field: 'lineid', headerName: 'Line ID', width: 140 },
  { field: 'floor', headerName: 'Floor', width: 140 },
 
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <>
        <Link href="tenantmaintenance/addtenant" passHref>
          <IconButton component="a">
            <EditIcon />
          </IconButton>
        </Link>
        <IconButton >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
];

const rows = [
  { id: 'A001', roomnumber: 'A001', fullname: 'Ahmad', floor: '1', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A002', roomnumber: 'A001', fullname: 'Ahmad', floor: '1', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A003', roomnumber: 'A001', fullname: 'Ahmad', floor: '1', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A004', roomnumber: 'A001', fullname: 'Ahmad', floor: '2', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A005', roomnumber: 'A001', fullname: 'Ahmad', floor: '1', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A006', roomnumber: 'A001', fullname: 'Ahmad', floor: '1', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A007', roomnumber: 'A001', fullname: 'Ahmad', floor: '1', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A008', roomnumber: 'A001', fullname: 'Ahmad', floor: '2', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A009', roomnumber: 'A001', fullname: 'Ahmad', floor: '1', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
];

const handleDelete = (id) => {
  // Implement your delete logic here
  console.log(`Delete tenant with ID: ${id}`);
};

export default function ratetable() {
  const [searchText, setSearchText] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())
    ) &&
    (filterValue === '' || row.roomstatus === filterValue)
  );

  return (
    <>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
          <Typography variant="h4">Tenant Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Remove or Add Tenant
          </Typography>
        </CardContent>
        <CardContent>
          <Link href="tenantmaintenance/addtenant" passHref>
            <Button
              variant="contained"
              sx={{ width: '60px', marginTop: '15px' }}
              component="a"
            >
              Add
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{marginTop: '10px', height: '89%', width: '100%' }}>
        <CardContent >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchText}
              onChange={handleSearchTextChange}
              sx={{ marginRight: '10px', width: '80%' }}
            />
            <Select
              value={filterValue}
              onChange={handleFilterChange}
              displayEmpty
              variant="outlined"
              sx={{width: '20%'}}
            >
              <MenuItem value="" disabled>
                Filter
              </MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
            </Select>
          </div>

          <div style={{ height: 'calc(100% - 40px)', width: '100%' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              checkboxSelection
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
