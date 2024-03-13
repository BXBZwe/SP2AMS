import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  IconButton, 
  FormControl, 
  InputLabel,
} from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ratetable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [tenants, setTenants] = useState([]);
  const columns = [
    { field: "id", headerName: "Tenant ID", width: '150' },
    { field: "roomnumber", headerName: "Room Number", width: '150' },
    { field: "fullname", headerName: "Fullname", width: '150' },
    { field: "phnumber", headerName: "Phone Number", width: '150' },
    { field: "accountStatus", headerName: "Account Status", width: '150' },
    { field: "contractStatus", headerName: "Contract Status", width: '150' },
    { field: "paymentOption", headerName: "Payment Option", width: '150' },
    {
      field: "actions",
      headerName: "Actions",
      width: '150',
      renderCell: (params) => {
        const tenant_id = params.row.id;
        return (
          <>
            <Link href={`/tenantmaintenance/UpdateTenant/${tenant_id}`} passHref>
              <IconButton component="a">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={() => handleDelete(tenant_id)}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleDelete = async (tenant_id) => {
    try {
      await axios.delete(`http://localhost:3000/deletetenants/${tenant_id}`);
      fetchTenants();
    } catch (error) {
      console.error(`Error deleting tenant with ID: ${tenant_id}`, error);
    }
  };

  const fetchTenants = async () => {
    try {
      let response = await axios.get("http://localhost:3000/getalltenants");
      let fetchedTenants = response.data.getTenant;
      
      if (filter) {
        fetchedTenants = fetchedTenants.filter(tenant => tenant.contract_status === filter);
      }
      
      setTenants(fetchedTenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [filter]);

  const handleSearchTextChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchQuery(searchText);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const formattedTenants = tenants
  .map((tenant) => ({
    id: tenant.tenant_id,
    fullname: `${tenant.first_name} ${tenant.last_name}`,
    phnumber: tenant.contacts?.phone_number || "N/A",
    roomnumber: tenant.RoomBaseDetails?.room_number,
    accountStatus: tenant.account_status || "N/A",
    contractStatus: tenant.contract_status || "N/A",
    paymentOption: tenant.invoice_option || "N/A",
  }))
  .filter(
    (tenant) =>
      tenant.fullname.toLowerCase().includes(searchQuery) ||
      (tenant.roomnumber && tenant.roomnumber.toLowerCase().includes(searchQuery)) ||
      tenant.id.toString().toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <Card sx={{ width: "100%", display: "flex" }}>
        <CardContent sx={{ marginRight: "auto", marginBottom: "10px" }}>
          <Typography variant="h4">Tenant Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Remove or Add Tenant
          </Typography>
        </CardContent>
        <CardContent>
          <Link href="tenantmaintenance/addtenant" passHref>
            <Button variant="contained" sx={{ width: "110px", marginTop: "15px" }} component="a">
              Add
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card sx={{ width: "100%", overflow: "hidden", marginTop: "10px" }}>
        <CardContent>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <TextField
          label="Search by ID, Room Number, or Fullname"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{  marginRight: "10px", width: "80%"}}
        />
        <FormControl variant="outlined" sx={{ width: "20%" }}>
          <InputLabel id="filter-label">Contract Status</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Contract Status"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="NEW">New</MenuItem>
            <MenuItem value="ONGOING">Ongoing</MenuItem>
            <MenuItem value="DUE">Due</MenuItem>
            <MenuItem value="WARNING">Warning</MenuItem>
            <MenuItem value="CHECKOUT">Checkout</MenuItem>
            <MenuItem value="TERMINATED">Terminated</MenuItem>
          </Select>
        </FormControl>
          </div>

          <Card sx={{ width: "100%", overflow: "hidden", marginTop: "10px" }}>
          <DataGrid
            rows={formattedTenants}
            columns={columns}
            pageSize={5}
            sx={{
              "& .MuiDataGrid-main": { maxHeight: "70vh" },
            }}
            autoHeight
            density="compact"
          />
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
