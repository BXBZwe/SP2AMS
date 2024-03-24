import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Button, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

export default function RoomDetailsTable() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationDates, setGenerationDates] = useState([]);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");

  useEffect(() => {
    fetchGenerationDates();
  }, []);

  useEffect(() => {
    if (selectedGenerationDate) {
      fetchRoomDetails();
    }
  }, [selectedGenerationDate]);

  const fetchGenerationDates = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getgenerationdate");
      setGenerationDates(response.data.dates);
      if (response.data.dates.length > 0) {
        setSelectedGenerationDate(response.data.dates[0]);
      }
    } catch (error) {
      console.error("Error fetching generation dates:", error);
    }
  };

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/getbillingdetails", {
        params: {
          generationDate: selectedGenerationDate,
        },
      });
      setRooms(response.data.paymentDetails);
    } catch (error) {
      console.error("Error fetching room details:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "room_number", headerName: "Room Number", flex:0.14, },
    { field: "tenant_name", headerName: "Tenant Name", flex:0.14, },
    { field: "total_bill", headerName: "Total Bill", flex:0.14, },
    {
      field: "actions",
      headerName: "Actions",
      flex:0.14,
      renderCell: (params) => {
        const roomId = params.row.room_id;
        return (
          <Link href={`/summarybillingdetails/${roomId}`} passHref>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
        );
      },
    },
  ];

  const ITEM_HEIGHT = 48;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Box sx={{ marginBottom: 2 }}>
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Summary Billing Details
        </Typography>
        <Box sx={{ width: 300, maxWidth: '100%' }}> {/* Adjust the width as needed */}
          <FormControl fullWidth margin="normal">
                <InputLabel>Generation Date</InputLabel>
                <Select 
                                  label="Generation Date" 

                  value={selectedGenerationDate || ""} 
                  onChange={(e) => setSelectedGenerationDate(e.target.value)}
                  // displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: ITEM_HEIGHT * 2.5, // Set the max-height to show 3.5 items at a time
                      },
                    },
                  }}
                >
                                      <MenuItem value="" disabled>
                  <em>No Date</em>
                </MenuItem>
                  {generationDates?.map((date, index) => (
                    <MenuItem key={index} value={date}>
                      {new Date(date).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
      <DataGrid rows={rooms} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} loading={loading} />
    </div>
  );
}
