import { React, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
export default function CheckIn() {
  const rooms = [
    {
      value: "R102",
      label: "102",
    },
    {
      value: "R101",
      label: "101",
    },
  ];
  const tenants = [
    {
      value: "P1",
      label: "Yasi",
    },
    {
      value: "P2",
      label: "Saw",
    },
  ];

  const [selectedRoom, setSelectedRoom] = useState(""); // Initialize with an empty string
  const [selectedTenant, setSelectedTenant] = useState(""); // Initialize with an empty string

  return (
    <>
      <div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Check-In</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Add New Tenants to the rooms they rent
          </Typography>
          <Divider />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box>
            <Card sx={{ width: "60vw", marginBottom: "10px" }}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  Select Room/Tenant
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    id="roomId"
                    select
                    label="Room Number"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    sx={{ width: "40vw", marginBottom: "10px" }}
                  >
                    {rooms.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    id="tenantId"
                    select
                    label="Tenant Name"
                    value={selectedTenant}
                    onChange={(e) => setSelectedTenant(e.target.value)}
                    sx={{ width: "40vw" }}
                  >
                    {tenants.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ width: "60vw" }}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  Input Contract Details
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Card sx={{ width: "38vw", marginLeft: "1vw" }}>
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                Input Contract Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                Recent Activity
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    </>
  );
}
