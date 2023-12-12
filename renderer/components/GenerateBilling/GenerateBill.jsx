// import {React,useState,useEffect} from "react";
// import { Box, Typography, Divider, Card,CardContent,TextField,MenuItem,Button } from "@mui/material";
// export default function GenerateBill() {
//   const roomDetails = [
//     {
//       roomId: "R001",
//       room: "101",
//       moveInDate: "20/02/2022",
//       moveOutDate: "20/02/2023",
//       tenantId: "123",
//       tenantName: "Yasi",
//       depositAmount: 3000,
//       monthsLeft: 6,
//       dueDate: "20/02/2023",
//       dayMonth: "Tuesday,March",
//       status: "occupied",
//     },
//     {
//       roomId: "R002",
//       room: "102",
//       moveInDate: "19/01/2022",
//       moveOutDate: "19/01/2023",
//       tenantId: "124",
//       tenantName: "Zwe",
//       depositAmount: 5000,
//       monthsLeft: 3,
//       dueDate: "20/02/2023",
//       dayMonth: "Wednesday,May",
//       status: "occupied",
//     },
//     {
//       roomId: "R003",
//       room: "203",
//       moveInDate: "20/02/2022",
//       moveOutDate: "20/02/2025",
//       tenantId: "125",
//       tenantName: "Saw",
//       depositAmount: 2500,
//       monthsLeft: 1,
//       dueDate: "20/02/2023",
//       dayMonth: "Friday,December",
//       status: "occupied",
//     },
//     {
//       roomId: "R004",
//       room: "201",
//       moveInDate: "",
//       moveOutDate: "",
//       tenantId: "",
//       tenantName: "",
//       depositAmount: 0,
//       monthsLeft: 0,
//       dueDate: "",
//       dayMonth: "",
//       status: "vacant",
//     },
//   ];

//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [selectedRoomList, setSelectedRoomList] = useState([]);


//   return (
//     <div>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           marginBottom: "10px",
//         }}
//       >
//         <Typography variant="h4">Generate Billing</Typography>
//         <Typography variant="body2" sx={{ opacity: 0.7 }}>
//           Generate billing for all or specific rooms
//         </Typography>
//         <Divider />
//           <Card sx={{ width: "55vw", marginTop: "10px" }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ marginBottom: "10px" }}>
//                 Select Rooms 
//               </Typography>

//               <Box sx={{ display: "flex", gap: "30px" }}>

//                 <TextField
//                   id="roomId"
//                   select
//                   label="Room Number"
//                   value={selectedRoom}
//                   onChange={(e) => setSelectedRoom(e.target.value)}
//                   sx={{ width: "40vw", marginBottom: "10px" }}
//                   error={
//                     addButtonClicked && (!selectedRoom || selectedRoom === "")
//                   }
//                   helperText={
//                     addButtonClicked && (!selectedRoom || selectedRoom === "")
//                       ? "The field cannot be empty."
//                       : ""
//                   }
//                 >
//                   {roomDetails.map((option) => (
//                     <MenuItem key={option.roomId} value={option.room}>
//                       {option.room}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//                 <Button variant="contained" size="small" sx={{  width: '10vw', marginBottom:'10px'}}>Add</Button>

//               </Box>
//             </CardContent>
//             <Card sx={{margin:'15px'}}>Room 101</Card>
//           </Card>
//       </Box>
//     </div>
//   );
// }


import { React, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

export default function GenerateBill() {
  const roomDetails = [
    {
      roomId: "R001",
      room: "101",
      moveInDate: "20/02/2022",
      moveOutDate: "20/02/2023",
      tenantId: "123",
      tenantName: "Yasi",
      depositAmount: 3000,
      monthsLeft: 6,
      dueDate: "20/02/2023",
      dayMonth: "Tuesday,March",
      status: "occupied",
    },
    {
      roomId: "R002",
      room: "102",
      moveInDate: "19/01/2022",
      moveOutDate: "19/01/2023",
      tenantId: "124",
      tenantName: "Zwe",
      depositAmount: 5000,
      monthsLeft: 3,
      dueDate: "20/02/2023",
      dayMonth: "Wednesday,May",
      status: "occupied",
    },
    {
      roomId: "R003",
      room: "203",
      moveInDate: "20/02/2022",
      moveOutDate: "20/02/2025",
      tenantId: "125",
      tenantName: "Saw",
      depositAmount: 2500,
      monthsLeft: 1,
      dueDate: "20/02/2023",
      dayMonth: "Friday,December",
      status: "occupied",
    },
    {
      roomId: "R004",
      room: "201",
      moveInDate: "",
      moveOutDate: "",
      tenantId: "",
      tenantName: "",
      depositAmount: 0,
      monthsLeft: 0,
      dueDate: "",
      dayMonth: "",
      status: "vacant",
    },
  ];

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRoomList, setSelectedRoomList] = useState([]);

  const handleAddButtonClick = () => {
    if (selectedRoom) {
      setSelectedRoomList((prevList) => [...prevList, selectedRoom]);
      setSelectedRoom(""); // Clear selectedRoom after adding
    }
  };

  useEffect(() => {
    // You can perform additional actions when selectedRoomList changes
    // For now, it will log the current selectedRoomList
    console.log("Selected Room List:", selectedRoomList);
  }, [selectedRoomList]);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h4">Generate Billing</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Generate billing for all or specific rooms
        </Typography>
        <Divider />
        <Card sx={{ width: "55vw", marginTop: "10px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
              Select Rooms
            </Typography>

            <Box sx={{ display: "flex", gap: "30px" }}>
              <TextField
                id="roomId"
                select
                label="Room Number"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                sx={{ width: "40vw", marginBottom: "10px" }}
              >
                {roomDetails.map((option) => (
                  <MenuItem key={option.roomId} value={option.room}>
                    {option.room}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                size="small"
                sx={{ width: "10vw", marginBottom: "10px" }}
                onClick={handleAddButtonClick}
              >
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Render selected rooms */}
        {selectedRoomList.length > 0 && (
          <Card sx={{ margin: "15px" }}>
            <CardContent>
              <Typography variant="h6">Selected Rooms</Typography>
              {selectedRoomList.map((room, index) => (
                <Typography key={index}>{room}</Typography>
              ))}
            </CardContent>
          </Card>
        )}
      </Box>
    </div>
  );
}
