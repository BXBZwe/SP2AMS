import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent } from "@mui/material";
import Link from 'next/link';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const columns = [
    { field: 'id', headerName: 'Item ID', width: 170 },
    { field: 'itemname', headerName: 'Item Name', width: 170 },
    {
      field: 'fee',
      headerName: 'Item Fee',
      
      width: 170,
    },
    {
      field: 'addeddate',
      headerName: 'Added Date',
      
      width: 170,
    },
    {
      field: 'enddate',
      headerName: 'End Date',
      
      width: 170,
    },
    
  ];
  const rows = [
    { id: 'A001', itemname: 'A001', fee: 35, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A002', itemname: 'A001', fee: 42, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A003', itemname: 'A001', fee: 45, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A004', itemname: 'A001', fee: 16, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A005', itemname: 'A001', fee: 200, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A006', itemname: 'A001', fee: 150, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A007', itemname: 'A001', fee: 44, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A008', itemname: 'A001', fee: 36, addeddate: '23/01/2023', enddate: '01/23/2024' },
    { id: 'A009', itemname: 'A001', fee: 65, addeddate: '23/01/2023', enddate: '01/23/2024' },
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
        <Typography variant="h4">Rate Maintenance</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Remove or Add Items
        </Typography>
</CardContent>
<CardContent>
        <Link href="ratemaintenance/addrate" passHref>
            <Button
              variant="contained"
              sx={{ width: "100px", marginTop: '15px' }}
              component="a"  // Use "a" as the component when using passHref with Link
            >
              Add Item
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
