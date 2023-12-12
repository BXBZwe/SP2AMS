import React from 'react'

import Checkbox from '@mui/material/Checkbox';

import TextField from '@mui/material/TextField';
import {Card, CardContent, Typography, Box, Button} from "@mui/material";

export default function addrate() {
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
  return (
    <>

        <Box sx={{textAlign: 'right'}}>
        <Button
              variant="contained"
              component="a"   
            >
              Edit
        </Button></Box>

    <Card sx={{ width: "100%", marginBottom: "10px", display: 'flex'}}>
    
    <CardContent sx={{display: 'inline-block'}}>
    
    <Typography variant="h4" sx={{marginBottom: 2}}>Select Room/Tenant</Typography>        
    
    <TextField id="outlined-basic" label="Item Name" variant="outlined" sx={{width: 150, marginBottom: 1.5, marginRight: 5, display: 'inline-block'}}/>
    <br></br>
    <TextField id="outlined-basic" label="Unit Price" variant="outlined" sx={{width: 150, marginBottom: 1.5, marginRight: 5, display: 'inline-block'}}/>
    <br></br>
    <TextField id="outlined-basic" label="Item Ranking" variant="outlined" sx={{width: 150, marginBottom: 1.5, marginRight: 5, display: 'inline-block'}}/>
    

    
 </CardContent>
 <CardContent sx={{marginTop: 5.5}}>
    
    <Typography sx={{display: 'inline-block', marginLeft: 10}}>
    <b>VAT</b>
    <Checkbox {...label} defaultChecked sx={{marginLeft: 5}}/><span style={{opacity: '60%'}}>Add VAT 7% to Price</span><br></br>
    <b>Payment</b> 
    <Checkbox {...label} defaultChecked sx={{marginLeft: 0.7}}/><span style={{opacity: '60%'}}>Billing After Usage</span><br></br>
    <b>Meter</b> 
    <Checkbox {...label} defaultChecked sx={{marginLeft: 3.3}}/><span style={{opacity: '60%'}}>Calculate from Meter</span><br></br>
    <b>Bill</b> 
    <Checkbox {...label} defaultChecked sx={{marginLeft: 5.8}}/><span style={{opacity: '60%'}}>Show Month on Bill</span><br></br>
    <b>Usage</b> 
    <Checkbox {...label} defaultChecked sx={{marginLeft: 2.9}}/><span style={{opacity: '60%'}}>Not Use Item</span> <br></br>
     
    </Typography><br></br>
    
    </CardContent>
    </Card>
    </>
  )
}
