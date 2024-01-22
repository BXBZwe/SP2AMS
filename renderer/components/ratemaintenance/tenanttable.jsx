import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Card, CardContent, TextField, Select, MenuItem, Button, IconButton } from "@mui/material";
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';



export default function ratetable() {
  const [searchText, setSearchText] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');
  const [tenants, setTenants] = React.useState([]);
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
      renderCell: (params) => {
        console.log("params:", params)
        const tenant_id = params.row.id;
        console.log("This tenant id ", tenant_id)
        return (
          <>
            <Link href={`/tenantmaintenance/Update&DeleteTenant/${tenant_id}`} passHref>
              <IconButton component="a">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={() => handleDelete(tenant_id)}> 
              <DeleteIcon />
            </IconButton>
          </>
        )
      },
    },
  ];

  const handleDelete = async (tenant_id) => {
    try {
      await axios.delete(`http://localhost:3000/deletetenants/${tenant_id}`);
      console.log(`Tenant with ID: ${tenant_id} deleted successfully`);
      fetchTenants();

  
    } catch (error) {
      console.error(`Error deleting tenant with ID: ${tenant_id}`, error);
    }
  };
  
  const fetchTenants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getalltenants');
      console.log("Raw tenants data:", response.data.getTenant); 
      setTenants(response.data.getTenant);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const formattedTenants = tenants.map((tenant) => ({
    id: tenant.tenant_id,
    roomnumber: tenant.room_id, 
    fullname: `${tenant.first_name} ${tenant.last_name}`,
    phnumber: tenant.contacts?.phone_number || 'N/A', 
    lineid: tenant.contacts?.line_id || 'N/A',
    floor: tenant.roomBaseDetails?.floor || 'N/A',
  }));

  


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

      <Card sx={{ marginTop: '10px', height: '89%', width: '100%' }}>
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
              sx={{ width: '20%' }}
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
              rows={formattedTenants}
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
