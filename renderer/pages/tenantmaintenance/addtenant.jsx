<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
export default function addtenant() {
  const type = [{ label: "+93" }, { label: "+66" }, { label: "+10" }];
  const [tenantData, setTenantData] = useState({
    first_name: "",
    last_name: "",
    personal_id: "",
    room_id: "",
=======
import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Card, CardContent, Typography, Box, Button, Select, MenuItem } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
export default function addtenant() {
  const paymentOptions = ['EMAIL', 'PAPER', 'BOTH'];

  const type = [
    { label: '+93' },
    { label: '+66' },
    { label: '+10' },
  ];
  const [tenantData, setTenantData] = useState({
    first_name: '',
    last_name: '',
    personal_id: '',
    payment_option: '',
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae
    addresses: {
      street: "",
      sub_district: "",
      district: "",
      province: "",
      postal_code: "",
    },
    contacts: {
      phone_number: "",
      email: "",
      line_id: "",
      eme_name: "",
      eme_phone: "",
      eme_line_id: "",
      eme_relation: "",
    },
  });
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrooms");
        setRooms(response.data.getrooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
=======
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae

    if (keys.length === 1) {
      setTenantData({ ...tenantData, [name]: value });
    } else if (
      keys.length === 2 &&
      (keys[0] === "addresses" || keys[0] === "contacts")
    ) {
      setTenantData({
        ...tenantData,
        [keys[0]]: {
          ...tenantData[keys[0]],
          [keys[1]]: value,
        },
      });
    }
  };
<<<<<<< HEAD
=======

>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
<<<<<<< HEAD
      const response = await axios.post(
        "http://localhost:3000/addtenants",
        tenantData
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Tenant added successfully:", response.data);
        setMessage("Tenant added successfully");
=======
      const response = await axios.post('http://localhost:3000/addtenants', tenantData);

      if (response.status === 200 || response.status === 201) {
        console.log('Tenant added successfully:', response.data);
        setMessage('Tenant added successfully');
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae
      } else {
        throw new Error("An error occurred while adding the tenant");
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("Error adding tenant:", error);
      setMessage(
        error.response?.data?.message || error.message || "An error occurred"
      );
=======
      console.error('Error adding tenant:', error);
      setMessage(error.response?.data?.message || error.message || 'An error occurred');
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Tenant Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Remove or Add Tenant{" "}
          </Typography>
        </CardContent>
        <CardContent>
<<<<<<< HEAD
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "110px", marginTop: "15px" }}
=======


          <Button
            type="submit"
            variant="contained"
            sx={{ width: "110px", marginTop: '15px' }}
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae
            component="a"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex",  }}>
        <Card sx={{ width: "100%", marginBottom: "10px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Tenant Details
            </Typography>

            <Box sx={{ display: "flex" }}>
              <TextField
                id="first_name"
                name="first_name"
                label="First Name"
                value={tenantData.first_name}
                variant="outlined"
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5, marginRight: 0.6 }}
              />
              <TextField
                id="last_name"
                name="last_name"
                label="Last Name"
                value={tenantData.last_name}
                variant="outlined"
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5 }}
              />
            </Box>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Male"
              name="radio-buttons-group"
              sx={{ display: "inline" }}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>

<<<<<<< HEAD
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <TextField
                id="personal_id"
                name="personal_id"
                label="Personal ID"
                value={tenantData.personal_id}
                variant="outlined"
                onChange={handleChange}
                sx={{ width: "40%", marginBottom: 1.5, marginRight: 0.6 }}
              />
=======

            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <TextField id="personal_id" name="personal_id" label="Personal ID" value={tenantData.personal_id} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={type}
                sx={{ width: "20%", marginBottom: 1.5, marginRight: 0.5 }}
                renderInput={(params) => <TextField {...params} label="Code" />}
              />
              <TextField
                id="phone_number"
                name="contacts.phone_number"
                label="Phone Number"
                value={tenantData.phone_number}
                variant="outlined"
                onChange={handleChange}
                sx={{ width: "40%", marginBottom: 1.5 }}
              />
            </Box>
            <Box sx={{ display: "flex" }}>
              <TextField
                id="email"
                name="contacts.email"
                label="Email"
                variant="outlined"
                value={tenantData.email}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5, marginRight: 0.5 }}
                type="email"
              />
              <TextField
                id="line_id"
                name="contacts.line_id"
                label="Line ID"
                variant="outlined"
                value={tenantData.line_id}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5 }}
              />
            </Box>

<<<<<<< HEAD
            <Typography sx={{ marginBottom: 1, marginTop: "10px", }}>
              Address
            </Typography>
            <Box sx={{ display: "flex", gap:0.5 }}>
              <TextField
                id="street"
                name="addresses.street"
                label="Street"
                variant="outlined"
                value={tenantData.street}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5,  }}
              />
=======
            {/* <Autocomplete
              disablePortal
              id="payment_option"
              sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }}
              renderInput={(params) => <TextField {...params} label="Invoice Options" />}
              value={tenantData.payment_option}
              onChange={(e) => setTenantData({ ...tenantData, payment_option: e.target.value })}
            /> */}
            <Select
              label="Invoice Option"
              id="payment_option"
              value={tenantData.payment_option}
              onChange={(e) => setTenantData({ ...tenantData, payment_option: e.target.value })}
              sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }}
            >
              {paymentOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            <TextField id="email" name="contacts.email" label="Email" variant="outlined" value={tenantData.email} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <TextField id="line_id" name="contacts.line_id" label="Line ID" variant="outlined" value={tenantData.line_id} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <Typography sx={{ marginBottom: 1, marginTop: '10px' }}>Address</Typography>
            <TextField id="street" name="addresses.street" label="Street" variant="outlined" value={tenantData.street} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae

              <TextField
                id="district"
                name="addresses.district"
                label="District"
                value={tenantData.district}
                onChange={handleChange}
                variant="outlined"
                sx={{ width: "50%", marginBottom: 1.5 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap:0.5 }}>
              <TextField
                id="sub_district"
                name="addresses.sub_district"
                label="Sub District"
                variant="outlined"
                value={tenantData.sub_district}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5,  }}
              />

              <TextField
                id="province"
                name="addresses.province"
                label="Province"
                variant="outlined"
                value={tenantData.province}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5, }}
              />
            </Box>
            <Box sx={{ display: "flex", gap:0.5 }}>
              <TextField
                id="postal_code"
                name="addresses.postal_code"
                label="Postal Code"
                value={tenantData.postal_code}
                variant="outlined"
                onChange={handleChange}
                sx={{ width: "50%"}}
              />
            </Box>
          </CardContent>
          <Box sx={{ marginBottom: 2, marginLeft: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 1.5 }}>
              Emergency Contact
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <TextField
                id="eme_name"
                name="contacts.eme_name"
                label="Full Name"
                variant="outlined"
                value={tenantData.eme_name}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5, marginRight: 0.5 }}
              />
              <TextField
                id="eme_phone"
                name="contacts.eme_phone"
                label="Phone Number"
                variant="outlined"
                value={tenantData.eme_phone}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5,  }}
              />
              <TextField
                id="eme_line_id"
                name="contacts.eme_line_id"
                label="Line ID"
                variant="outlined"
                value={tenantData.eme_line_id}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5, marginRight: 0.5 }}
              />
              <TextField
                id="eme_relation"
                name="contacts.eme_relation"
                label="Relationship"
                variant="outlined"
                value={tenantData.eme_relation}
                onChange={handleChange}
                sx={{ width: "50%", marginBottom: 1.5 }}
              />
            </Box>
          </Box>
        </Card>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
          <Card
            sx={{
              display: "inline-block",
              width: "28vw",
              marginLeft: 2,
              marginBottom: "10px",
              height: 300,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: 0.3,
                  fontWeight: "bold",
                  fontSize: "19px",
                }}
              >
                Tenant Image
              </Typography>
              <Typography
                sx={{ textAlign: "center", margin: 0, opacity: "50%" }}
              >
                Attach a pciture of tenant{" "}
              </Typography>
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 10 }}>
                <Fab color="secondary" aria-label="add">
                  <AddIcon />
                </Fab>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              display: "inline-block",
              width: "28vw",
              marginLeft: 2,
              marginBottom: "10px",
              height: 300,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: 0.3,
                  fontWeight: "bold",
                  fontSize: "19px",
                }}
              >
                National Thai Citizen ID or Passport
              </Typography>
              <Typography
                sx={{ textAlign: "center", margin: 0, opacity: "50%" }}
              >
                Attach a a of the tenant Identification{" "}
              </Typography>
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 10 }}>
                <Fab color="secondary" aria-label="add">
                  <AddIcon />
                </Fab>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
<<<<<<< HEAD
  );
}
=======
  )
}
>>>>>>> 0252de347f396ddfd00e7d7e8f85a5a8a00928ae
