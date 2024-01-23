import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
export default function addtenant() {

  const type = [
    { label: '+93' },
    { label: '+66' },
    { label: '+10' },
  ];
  const [tenantData, setTenantData] = useState({
    first_name: '',
    last_name: '',
    personal_id: '',
    room_id: '',
    addresses: {
      street: '',
      sub_district: '',
      district: '',
      province: '',
      postal_code: ''
    },
    contacts: {
      phone_number: '',
      email: '',
      line_id: '',
      eme_name: '',
      eme_phone: '',
      eme_line_id: '',
      eme_relation: ''
    }
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getallrooms');
        setRooms(response.data.getrooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
  
    if (keys.length === 1) {
      setTenantData({ ...tenantData, [name]: value });
    } else if (keys.length === 2 && (keys[0] === 'addresses' || keys[0] === 'contacts')) {
      setTenantData({
        ...tenantData,
        [keys[0]]: {
          ...tenantData[keys[0]],
          [keys[1]]: value
        }
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:3000/addtenants', tenantData);
      
      if (response.status === 200 || response.status === 201) {
        console.log('Tenant added successfully:', response.data);
        setMessage('Tenant added successfully'); 
      } else {
        throw new Error('An error occurred while adding the tenant');
      }
    } catch (error) {
      console.error('Error adding tenant:', error);
      setMessage(error.response?.data?.message || error.message || 'An error occurred'); 
    } finally {
      setLoading(false); 
    }
  };
  
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
            type="submit"
            variant="contained"
            sx={{ width: "110px", marginTop: '15px' }}
            component="a"  
            onClick={handleSubmit}
            disabled={loading} 
          >
            {loading ? 'Adding...' : 'Save'}
          </Button>

        </CardContent>

      </Card>
      <Box sx={{ display: 'flex', height: '90%' }}>

        <Card sx={{ width: "100%", marginBottom: "10px" }}>

          <CardContent>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Tenant Details</Typography>

            <TextField id="first_name" name="first_name" label="First Name" value={tenantData.first_name} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            <TextField id="last_name" name="last_name" label="Last Name" value={tenantData.last_name} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            <br></br>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Male"
              name="radio-buttons-group"
              sx={{ display: "inline" }}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>


            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField id="personal_id" name="personal_id" label="Personal ID" value={tenantData.personal_id} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={type}
                sx={{ width: 90, marginBottom: 1.5, marginRight: 0.5 }}
                renderInput={(params) => <TextField {...params} label='Code' />}
              />
              <TextField id="phone_number" name="contacts.phone_number" label="Phone Number" value={tenantData.phone_number} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            </Box>

            <Autocomplete
              disablePortal
              id="room-select"
              options={rooms}
              getOptionLabel={(option) => option.room_number}
              sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }}
              renderInput={(params) => <TextField {...params} label="Room Number" />}
              onChange={(event, value) => setTenantData({ ...tenantData, room_id: value ? value.room_id : '' })}
            />
            <TextField id="email" name="contacts.email" label="Email" variant="outlined" value={tenantData.email} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <TextField id="line_id" name="contacts.line_id" label="Line ID" variant="outlined" value={tenantData.line_id} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <Typography sx={{ marginBottom: 1, marginTop: '10px' }}>Address</Typography>
            <TextField id="street" name="addresses.street" label="Street" variant="outlined" value={tenantData.street} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />

            <TextField id="district" name="addresses.district" label="District" value={tenantData.district} onChange={handleChange} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <br></br>
            <TextField id="province" name="addresses.province" label="Province" variant="outlined" value={tenantData.province} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />

            <TextField id="postal_code" name="addresses.postal_code" label="Postal Code" value={tenantData.postal_code} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <br></br>
            <TextField id="sub_district" name="addresses.sub_district" label="Sub District" variant="outlined" value={tenantData.sub_district} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 5 }} />
          </CardContent>
          <Box sx={{ marginBottom: 2, marginLeft: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2, }} >Emergency Contact</Typography>
            <TextField id="eme_name" name="contacts.eme_name" label="Full Name" variant="outlined" value={tenantData.eme_name} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />
            <TextField id="eme_phone" name="contacts.eme_phone" label="Phone Number" variant="outlined" value={tenantData.eme_phone} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <TextField id="eme_line_id" name="contacts.eme_line_id" label="Line ID" variant="outlined" value={tenantData.eme_line_id} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />
            <TextField id="eme_relation" name="contacts.eme_relation" label="Relationship" variant="outlined" value={tenantData.eme_relation} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />

          </Box>

        </Card>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%' }}>
          <Card sx={{ display: 'inline-block', width: "28vw", marginLeft: 2, marginBottom: "10px", height: 300 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography sx={{ textAlign: 'center', marginBottom: 0.3, fontWeight: 'bold', fontSize: '19px' }}>Tenant Image</Typography>
              <Typography sx={{ textAlign: 'center', margin: 0, opacity: '50%' }}>Attach a pciture of tenant </Typography>
              <Box sx={{ '& > :not(style)': { m: 1 }, marginTop: 10 }}>

                <Fab color="secondary" aria-label="add">
                  <AddIcon />
                </Fab>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ display: 'inline-block', width: "28vw", marginLeft: 2, marginBottom: "10px", height: 300 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography sx={{ textAlign: 'center', marginBottom: 0.3, fontWeight: 'bold', fontSize: '19px' }}>National Thai Citizen ID or Passport</Typography>
              <Typography sx={{ textAlign: 'center', margin: 0, opacity: '50%' }}>Attach a a of the tenant Identification </Typography>
              <Box sx={{ '& > :not(style)': { m: 1 }, marginTop: 10 }}>

                <Fab color="secondary" aria-label="add">
                  <AddIcon />
                </Fab>
              </Box>
            </CardContent>
          </Card>
        </Box>

      </Box>
    </>
  )
}
