import React from 'react'
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {Card, CardContent, Typography, Box, Button} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
export default function addtenant() {
    const status = [
        { label: 'Booked' },
        { label: 'Not Booked' },
      ];
      const type = [
        { label: '+93'},
        { label: '+66'},
        { label: '+10'},
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
    <Card sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
                <CardContent
                sx={{
                    
                marginRight: "auto",
                marginBottom: "10px",
                    
                }}
                >
                <Typography variant="h4">Tenant Maintenance</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Remove or Add Tenant </Typography>
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
    <Typography variant="h4" sx={{marginBottom: 2}}>Tenant Details</Typography>        
    
    <TextField id="outlined-basic" label="First Name" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 2.5}}/>
    <TextField id="outlined-basic" label="Last Name" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 0.5}}/>
    <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="Male"
        name="radio-buttons-group"
        sx={{display: "inline"}}
      >
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
        <FormControlLabel value="Female" control={<Radio />} label="Female" />
      </RadioGroup>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <TextField id="outlined-basic" label="Personal ID" variant="outlined" sx={{width: 400, marginBottom: 1.5, marginRight: 2.5}}/>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={type}
        sx={{ width: 90, marginBottom: 1.5, marginRight: 0.5 }}
        renderInput={(params) => <TextField {...params} label='Code' />}
      />
      <TextField id="outlined-basic" label="Phone Number" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 0.6}} />
    </Box>
      
    <TextField id="outlined-basic" label="Room Number" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 2.5}}/>
    <TextField id="outlined-basic" label="Email" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 0.5}}/>
    <Typography sx={{marginBottom: 1}}>Address</Typography>
    <TextField id="outlined-basic" label="Street" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 2.5}}/>
    <TextField id="outlined-basic" label="District" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 0.5}}/>
    <TextField id="outlined-basic" label="Province" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 2.5}}/>
    <TextField id="outlined-basic" label="Postal Code" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 0.5}}/>
    <TextField id="outlined-basic" label="Sub District" variant="outlined" sx={{width: 270, marginBottom: 1.5, marginRight: 5}}/>
    </CardContent>
   
    
    </Card>
    
    <Card sx={{display: 'inline-block', width: "28vw", marginLeft: 2, marginBottom: "10px", height: 300}}>
      <CardContent sx={{textAlign: 'center'}}>
        <Typography sx={{textAlign: 'center', marginBottom: 0.3, fontWeight: 'bold', fontSize: '19px'}}>National Thai Citizen ID or Passport</Typography>
        <Typography sx={{textAlign: 'center', margin: 0, opacity: '50%'}}>Attach a a of the tenant Identification </Typography>
        <Box sx={{ '& > :not(style)': { m: 1 }, marginTop: 10 }}>
      
          <Fab color="secondary" aria-label="add">
            <AddIcon />
          </Fab>
        </Box>
      </CardContent>
    </Card>
    </Box>
    </>
  )
}
