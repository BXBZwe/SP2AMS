import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Stack, IconButton, TextField } from "@mui/material";
import Head from 'next/head';
import { deepOrange } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Profile() {
  const [manager, setManager] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchManagerData() {
      try {
        const response = await fetch('http://localhost:3000/manager'); // Adjust the URL as per your setup
        const data = await response.json();
        setManager(data.manager);
      } catch (error) {
        console.error("Failed to fetch manager data:", error);
      }
    }

    fetchManagerData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!manager) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>

      <Card sx={{ width: '100%' }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",  
          }}
        >
          <Typography variant="h4">Profile</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Manage Profile and Email Settings
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex' }}>
          <CardContent sx={{ display: 'inline-block' }}>
            <Stack direction="row" spacing={2}>
              <Avatar sx={{ bgcolor: deepOrange[500], width: 210, height: 210 }} variant="square">
                {manager.name.charAt(0)}
              </Avatar>
            </Stack>
          </CardContent>
          <CardContent>
            <Typography variant="h6"><b>Name <EditIcon sx={{ width: 18 }} /></b></Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {manager.name}
            </Typography>
            <Typography variant="h6"><b>Email <EditIcon sx={{ width: 18 }} /></b></Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {manager.email}
            </Typography>
            <Typography variant="h6"><b>Telephone <EditIcon sx={{ width: 18 }} /></b></Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {manager.phone_number}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <Typography variant="h6"><b>Change Password</b></Typography>
          <form>
            <Stack spacing={1} direction="row" alignItems="center">
              <TextField
                type={showPassword ? "text" : "password"}
                value={manager.password_hash}
                variant="outlined"
                disabled
              />
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Stack>
          </form>
        </CardContent>
      </Card>
      {/* Rest of the component */}
    </div>
  );
}
