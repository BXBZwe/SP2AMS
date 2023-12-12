import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, Box } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function addroom() {
    const status = [
        { label: 'Booked' },
        { label: 'Not Booked' },
      ];
      const type = [
        { label: 'Studio'},
        { label: 'Wifi'},
        { label: 'Studio'},
      ];
      const rent = [
        { label: 'Available' },
        { label: 'Not Available' },
      ]
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
      
      const rows = [
        { id: 'A001', itemid: 'Car Parking', fee: 35 },
        { id: 'A002', itemid: 'Furniture', fee: 42 },
        { id: 'A003', itemid: 'Fridge', fee: 45 },
        { id: 'A004', itemid: 'Air Con', fee: 16 },
        { id: 'A005', itemid: 'Air Con', fee: 200 },
        { id: 'A006', itemid: 'Air Con', fee: 150 },
        { id: 'A007', itemid: 'Air Con', fee: 44 },
        { id: 'A008', itemid: 'Air Con', fee: 36 },
        { id: 'A009', itemid: 'Air Con', fee: 65 },
      ];
  return (
    <>
    <Card sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
                <CardContent
                sx={{
                    
                marginRight: "auto",
                marginBottom: "10px",
                    
                }}
                >
                <Typography variant="h4">Room Number</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Configure Room Items and Details</Typography>
        </CardContent>
        <CardContent>

            <Button
              variant="contained"
              sx={{ width: "110px", marginTop: '15px' }}
              component="a"  // Use "a" as the component when using passHref with Link
            >
              Edit
            </Button>
          
</CardContent>

</Card>
    <Box sx={{ display: 'flex' }}>
      <Card sx={{ width: "48vw", marginBottom: "10px"}}>
    <CardContent>
    <Typography variant="h4" sx={{marginBottom: 2}}>Select Room/Tenant</Typography>        
    
    <TextField id="outlined-basic" label="Floor" variant="outlined" sx={{width: 70, marginBottom: 1.5, marginRight: 5}}/>
    <TextField id="outlined-basic" label="Room" variant="outlined" sx={{width: 150, marginBottom: 1.5, marginRight: 5}}/>
    <TextField id="outlined-basic" label="Deposit" variant="outlined" sx={{width: 150, marginBottom: 1.5, marginRight: 5}}/>
    
    <TextField id="outlined-basic" label="Rent" variant="outlined" sx={{marginBottom: 1.5}}/>  
    <Typography sx={{display: 'inline-block', margin: 1, marginLeft: 10}}>
      
    <Checkbox {...label} defaultChecked />
        <b>Rental Fee</b>
    </Typography>
    
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={type}
      sx={{ width: 250, marginBottom: 1.5}}
      renderInput={(params) => <TextField {...params} label="Type" />}
    />
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={status}
      sx={{ width: 250, marginBottom: 1.5}}
      renderInput={(params) => <TextField {...params} label="Status" />}
    />
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={rent}
      sx={{ width: 250, marginBottom: 1.5 }}
      renderInput={(params) => <TextField {...params} label="For Rent" />}
    />
    
    
    
    
    <br></br>
    <br></br>
    
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
      
    <TextField id="outlined-basic" label="Tenant" variant="outlined" sx={{margin: 2, width: 240}}/>
    <TextField id="outlined-basic" label="Contract Date" variant="outlined" sx={{margin: 2, width: 240}} />
    </CardContent>
   
    
    </Card>
    
    <Card sx={{display: 'inline-block', width: "28vw", marginLeft: 2, marginBottom: "10px"}}>
      <CardContent >
        <Typography variant="h4" sx={{textAlign: 'center', marginBottom: 1}}>Room Summary</Typography>
        <Typography variant="h6">Room Details</Typography>
        <Typography variant="h6">Rent & Deposit</Typography>
        <Typography variant="h6">Additional Items</Typography>
        <Typography variant="h6">Total Fees</Typography>
      </CardContent>
    </Card>
    </Box>
    </>
  )
}
