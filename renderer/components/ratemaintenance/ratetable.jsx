import * as React from 'react';
import { DataGrid, DataGridToolbar } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, IconButton, TextField, MenuItem, Select } from "@mui/material";
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { field: 'id', headerName: 'Item ID', width: 160 },
  { field: 'itemname', headerName: 'Item Name', width: 170 },
  { field: 'fee', headerName: 'Item Fee', width: 170 },
  { field: 'addeddate', headerName: 'Added Date', width: 170 },
  { field: 'enddate', headerName: 'End Date', width: 170 },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    width: 170,
    renderCell: (params) => (
      <>
        <Link href="ratemaintenance/addrate" passHref>
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

const initialRows = [
  { id: 'A001', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A002', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A003', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A004', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A005', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A006', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A007', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A008', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A009', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A0010', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A0011', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  { id: 'A0012', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
  // ... other rows ...
];

export default function RateTable() {
  const [searchText, setSearchText] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [rows, setRows] = React.useState(initialRows);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleDelete = (id) => {
    console.log(`Deleting row with id: ${id}`);
    // Implement logic to delete the row with the specified id
  };

  const handleSearch = () => {
    const filteredRows = initialRows.filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setRows(filteredRows);
  };

  React.useEffect(() => {
    // Reset the rows when the search text changes
    setRows(initialRows);
    handleSearch();
  }, [searchText]);

  return (
    <>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent
          sx={{
            marginRight: 'auto',
            marginBottom: '10px',
          }}
        >
          <Typography variant="h4">Rate Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Remove or Add Items
          </Typography>
        </CardContent>
        <CardContent>
          <Link href="ratemaintenance/addrate" passHref>
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
      <Card sx={{ height: '89%', width: '100%' }}>
        <CardContent>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ marginRight: '10px', width: '80%' }}
            />
            <Select
              value={filter}
              onChange={handleFilterChange}
              displayEmpty
              sx={{width: '20%'}}
              inputProps={{ 'aria-label': 'Filter' }}
            >
              <MenuItem value="" disabled>
                Filter
              </MenuItem>
              <MenuItem value="filter1">Filter 1</MenuItem>
              <MenuItem value="filter2">Filter 2</MenuItem>
              {/* Add more filter options as needed */}
            </Select>
          </div>
          <div style={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              components={{
                Toolbar: DataGridToolbar,
              }}
              componentsProps={{
                toolbar: {
                  items: (
                    <>
                      <div style={{ marginRight: '10px' }}>
                        <TextField
                          label="Search"
                          variant="outlined"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                      <Select
                        value={filter}
                        onChange={handleFilterChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Filter' }}
                      >
                        <MenuItem value="" disabled>
                          Filter
                        </MenuItem>
                        <MenuItem value="filter1">Filter 1</MenuItem>
                        <MenuItem value="filter2">Filter 2</MenuItem>
                        {/* Add more filter options as needed */}
                      </Select>
                    </>
                  ),
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
