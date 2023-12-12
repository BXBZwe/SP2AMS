import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent } from "@mui/material";
import Link from 'next/link';
  const columns = [
    { field: 'id', headerName: 'Tenant ID', width: 130 },
    { field: 'roomnumber', headerName: 'Room Number', width: 170 },
    {
      field: 'fullname',
      headerName: 'Full Name',
      
      width: 140,
    },
    {
      field: 'apartment',
      headerName: 'Apartment',
      
      width: 140,
    },
    {
      field: 'startdate',
      headerName: 'Start Date',
      
      width: 140,
    },
    {
      field: 'enddate',
      headerName: 'End Date',
      
      width: 140,
    },
    
  ];
  const rows = [
    { id: 'A001', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A002', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A003', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A004', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A005', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A006', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A007', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A008', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A009', roomnumber: 'A001', fullname: 'Ahmad', apartment: 'Building A', roomstatus: 'Available', startdate: '23/01/2023', enddate: '01/23/2024' },
  ];





export default function ratetable() {
  
  return (
    <>
    
      <Card sx={{ width: '100%', display: 'flex' }}>
          <CardContent
          sx={{
              
            marginRight: "auto",
            marginBottom: "10px",
              
          }}
          >
          <Typography variant="h4">Tenant Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Remove or Add Tenant  
          </Typography>
  </CardContent>
  <CardContent>
  <Link href="tenantmaintenance/addtenant" passHref>
            <Button
              variant="contained"
              sx={{ width: "121px", marginTop: '15px' }}
              component="a"  // Use "a" as the component when using passHref with Link
            >
              Add Tenant
            </Button>
          </Link>
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
        </div></CardContent>
  </Card>
  </>
      
  )
  
}