// import React, { useState, useEffect } from "react";
// import { Box, Card, CardContent, Typography, Select, MenuItem, TextField, Button } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import axios from "axios";

// export default function BillingDetails() {
//   const types = [
//     {
//       id: "1",
//       value: "Water Reading",
//     },
//     { id: "2", value: "Meter Reading" },
//   ];

//   const [selectedRooms, setSelectedRooms] = useState([]);
//   const [selectedType, setSelectedType] = useState(types[0].value);
//   const [currentReadings, setCurrentReadings] = useState({});
//   const [unitsDifference, setUnitsDifference] = useState({});
//   const [costs, setCosts] = useState({});
//   const [readingValues, setReadingValues] = useState({});
//   const [previousReadings, setPreviousReadings] = useState({});

//   const calculateUnitDifference = (current, previous) => {
//     return current - previous;
//   };

//   const calculateCost = (unitDifference, costPerUnit) => {
//     return unitDifference * costPerUnit;
//   };

//   const getroomsforbilling = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/generatebill");
//       const billedrooms = response.data.billRecords;
//       console.log("the rooms for generating bills:", billedrooms);
//       setSelectedRooms(
//         billedrooms.map((room) => ({
//           ...room,
//           generation_date: new Date(room.generation_date).toISOString().split("T")[0],
//         }))
//       );
//     } catch (error) {
//       console.error("Failed to fetch rooms:", error);
//     }
//   };

//   const getPreviousMeterReading = async (roomId, generationDate) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/getLastReadingBeforeDate/${roomId}`, {
//         params: { generation_date: generationDate },
//       });

//       if (response.data && response.data.data) {
//         return response.data.data;
//       } else {
//         return { water_reading: 0, electricity_reading: 0 };
//       }
//     } catch (error) {
//       console.error("Error fetching previous meter reading for room:", roomId, error);
//       return { water_reading: 0, electricity_reading: 0 };
//     }
//   };

//   const fetchPreviousReadings = async () => {
//     const promises = selectedRooms.map(async (room) => {
//       const prevReading = await getPreviousMeterReading(room.RoomBaseDetails.room_id, room.generation_date);
//       return { roomId: room.RoomBaseDetails.room_id, prevReading };
//     });

//     const results = await Promise.all(promises);
//     const newPreviousReadings = results.reduce((acc, { roomId, prevReading }) => {
//       acc[roomId] = prevReading;
//       return acc;
//     }, {});
//     console.log("New Previous Readings", newPreviousReadings);

//     setPreviousReadings(newPreviousReadings);
//   };

//   useEffect(() => {
//     getroomsforbilling();
//   }, []);

//   useEffect(() => {
//     if (selectedRooms.length > 0) {
//       fetchPreviousReadings();
//     }
//   }, [selectedRooms, selectedType]);

//   const handleReadingValueChange = (roomId, value) => {
//     const previousReading = currentReadings[roomId] || 0;
//     const unitDifference = calculateUnitDifference(value, previousReading);
//     const cost = calculateCost(unitDifference, selectedType === "Water Reading" ? 20 : 7);

//     setReadingValues((prevValues) => ({
//       ...prevValues,
//       [roomId]: value,
//     }));
//     setUnitsDifference((prevDifference) => ({
//       ...prevDifference,
//       [roomId]: unitDifference,
//     }));
//     setCosts((prevCosts) => ({
//       ...prevCosts,
//       [roomId]: cost,
//     }));
//   };

//   const saveReadings = async () => {
//     const readingPromises = selectedRooms.map(async (room) => {
//       const roomId = room.RoomBaseDetails.room_id;
//       const readingValue = readingValues[roomId];

//       if (readingValue === undefined) {
//         console.error(`No reading value provided for room ID: ${roomId}`);
//         return;
//       }

//       const payload = {
//         room_id: roomId,
//         reading_date: room.generation_date,
//         [selectedType.toLowerCase().replace(" ", "_")]: readingValue,
//       };

//       console.log(`Reading value in save reading function: ${readingValue}`);
//       console.log(`Payload in save reading function:`, payload);

//       try {
//         await axios.post("http://localhost:3000/addreading", payload);
//       } catch (error) {
//         console.error(`Failed to save reading for room ${roomId}:`, error);
//       }
//     });

//     await Promise.all(readingPromises);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           marginBottom: "10px",
//         }}
//       >
//         <Card sx={{ width: "100%", display: "flex", marginBottom: "10px" }}>
//           <CardContent
//             sx={{
//               marginRight: "auto",
//               marginBottom: "10px",
//             }}
//           >
//             <Typography variant="h4">Billing Details</Typography>
//             <Typography variant="body2" sx={{ opacity: 0.7 }}>
//               Enter billing details for specific rooms
//             </Typography>
//             <Button variant="contained" color="primary" onClick={saveReadings}>
//               Save All {selectedType}s
//             </Button>
//           </CardContent>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               marginRight: "15px",
//               width: "20%",
//             }}
//           >
//             <Select label="Reading Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} variant="outlined" sx={{ width: "100%" }}>
//               {types.map((item) => (
//                 <MenuItem key={item.id} value={item.value}>
//                   {item.value}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Box>
//         </Card>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             gap: "15px",
//           }}
//         >
//           <Card
//             sx={{
//               width: "100%",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {selectedRooms.map((room) => {
//               const roomId = room.RoomBaseDetails.room_id;
//               const previousWaterReading = previousReadings[roomId]?.water_reading || "N/A";
//               const previousElectricityReading = previousReadings[roomId]?.electricity_reading || "N/A";
//               const previousReading = previousReadings[room.RoomBaseDetails.room_id];
//               return (
//                 <Box key={`${room.RoomBaseDetails.room_id}-${room.generation_date}`} sx={{ margin: "10px" }}>
//                   <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                     <Typography sx={{ marginBottom: "10px" }} variant="h6">
//                       Room {room.RoomBaseDetails.room_number} - {selectedType}
//                     </Typography>
//                     <MoreVertIcon />
//                   </Box>

//                   {selectedType === "Meter Reading" && (
//                     <Box sx={{ display: "flex", gap: "10px" }}>
//                       <TextField type="number" variant="outlined" sx={{ width: "25%" }} label={`Previous ${selectedType}`} value={previousReading?.water_reading || "N/A"} disabled />
//                       <TextField label={`Current ${selectedType}`} type="number" variant="outlined" sx={{ width: "25%" }} value={readingValues[room.RoomBaseDetails.room_id] || ""} onChange={(e) => handleReadingValueChange(room.RoomBaseDetails.room_id, e.target.value)} />{" "}
//                       <TextField label="Units Difference" type="number" variant="outlined" sx={{ width: "25%" }} value={unitsDifference[room.id] || ""} disabled />
//                       <TextField label="Cost" type="number" variant="outlined" sx={{ width: "25%" }} value={costs[room.id] || 0} disabled />
//                     </Box>
//                   )}
//                   {selectedType === "Water Reading" && (
//                     <Box sx={{ display: "flex", gap: "10px" }}>
//                       <TextField label={`Previous ${selectedType}`} type="number" variant="outlined" sx={{ width: "25%" }} value={previousReading?.water_reading || "N/A"} disabled />
//                       <TextField label={`Current ${selectedType}`} type="number" variant="outlined" sx={{ width: "25%" }} value={readingValues[room.RoomBaseDetails.room_id] || ""} onChange={(e) => handleReadingValueChange(room.RoomBaseDetails.room_id, e.target.value)} />{" "}
//                       <TextField label="Units Difference" type="number" variant="outlined" sx={{ width: "25%" }} value={unitsDifference[room.id] || ""} disabled />
//                       <TextField label="Cost" type="number" variant="outlined" sx={{ width: "25%" }} value={costs[room.id] || 0} disabled />
//                     </Box>
//                   )}
//                 </Box>
//               );
//             })}
//           </Card>
//         </Box>
//       </Box>
//     </>
//   );
// }
