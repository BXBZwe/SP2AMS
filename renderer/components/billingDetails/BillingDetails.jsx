// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Select,
//   MenuItem,
//   TextField,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// export default function BillingDetails() {
//   const types = [
//     {
//       id: "1",
//       value: "Water Reading",
//     },
//     { id: "2", value: "Meter Reading" },
//   ];

//   const rooms = [
//     {
//       id: "1",
//       room: "101",
//       meter: 0,
//       water: 0,
//       lastMeter: 200,
//       lastWater: 333,
//     },
//     {
//       id: "2",
//       room: "102",
//       meter: 0,
//       water: 0,
//       lastMeter: 890,
//       lastWater: 33,
//     },
//     {
//       id: "3",
//       room: "103",
//       meter: 0,
//       water: 0,
//       lastMeter: 999,
//       lastWater: 38,
//     },
//     {
//       id: "4",
//       room: "201",
//       meter: 0,
//       water: 0,
//       lastMeter: 257,
//       lastWater: 38,
//     },
//     {
//       id: "5",
//       room: "202",
//       meter: 0,
//       water: 0,
//       lastMeter: 20,
//       lastWater: 3,
//     },
//     {
//       id: "6",
//       room: "203",
//       meter: 0,
//       water: 0,
//       lastMeter: 20,
//       lastWater: 3,
//     },
//     {
//       id: "7",
//       room: "302",
//       meter: 0,
//       water: 0,
//       lastMeter: 20,
//       lastWater: 3,
//     },
//   ];

//   const [selectedType, setSelectedType] = useState(types[0].value);
//   const [currentReadings, setCurrentReadings] = useState({});
//   const [unitsDifference, setUnitsDifference] = useState({});
//   const [costs, setCosts] = useState({});

//   const calculateUnitDifference = (current, previous) => {
//     return current - previous;
//   };

//   const calculateCost = (unitDifference, costPerUnit) => {
//     return unitDifference * costPerUnit;
//   };

//   const handleCurrentReadingChange = (roomId, currentValue) => {
//     const room = rooms.find((r) => r.id === roomId);
//     const unitDifference = calculateUnitDifference(currentValue, room[`last${selectedType}`]);
//     const cost = calculateCost(unitDifference, selectedType === "Water Reading" ? 20 : 7);

//     // Update the state with the current readings, units difference, and cost
//     setCurrentReadings((prevReadings) => ({
//       ...prevReadings,
//       [roomId]: currentValue,
//     }));
//     setUnitsDifference((prevDifference) => ({
//       ...prevDifference,
//       [roomId]: unitDifference,
//     }));
//     setCosts((prevCosts) => ({
//       ...prevCosts,
//       [roomId]: cost,
//     }));

//     // Update the room state
//     const updatedRooms = rooms.map((r) =>
//       r.id === roomId ? { ...r, [selectedType.toLowerCase()]: currentValue } : r
//     );
//     // Update the state
//     // setRooms(updatedRooms);
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
//             <Select
//               label="Reading Type"
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               variant="outlined"
//               sx={{ width: "100%" }}
//             >
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
//             {rooms.map((room) => (
//               <Box key={room.id} sx={{ margin: "10px" }}>
//                 <Box
//                   sx={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <Typography sx={{ marginBottom: "10px" }} variant="h6">
//                     Room {room.room}
//                   </Typography>
//                   <MoreVertIcon />
//                 </Box>

//                 {selectedType === "Meter Reading" && (
//                   <Box sx={{ display: "flex", gap: "10px" }}>
//                     <TextField
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       label={`Previous ${selectedType}`}
//                       value={room.lastMeter}
//                       disabled
//                     />
//                     <TextField
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       label={`Current ${selectedType}`}
//                       value={currentReadings[room.id] || ""}
//                       onChange={(e) =>
//                         handleCurrentReadingChange(room.id, e.target.value)
//                       }
//                     />
//                     <TextField
//                       label="Units Difference"
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       value={unitsDifference[room.id] || ""}
//                       disabled
//                     />
//                     <TextField
//                       label="Cost"
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       value={costs[room.id] || 0}
//                       disabled
//                     />
//                   </Box>
//                 )}
//                 {selectedType === "Water Reading" && (
//                   <Box sx={{ display: "flex", gap: "10px" }}>
//                     <TextField
//                       label={`Previous Water Reading`}
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       value={room.lastWater}
//                       disabled
//                     />
//                     <TextField
//                       label={`Current Water Reading`}
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       value={currentReadings[room.id] || ""}
//                       onChange={(e) =>
//                         handleCurrentReadingChange(room.id, e.target.value)
//                       }
//                     />
//                     <TextField
//                       label="Units Difference"
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       value={unitsDifference[room.id] || ""}
//                       disabled
//                     />
//                     <TextField
//                       label="Cost"
//                       type="number"
//                       variant="outlined"
//                       sx={{ width: "25%" }}
//                       value={costs[room.id] || 0}
//                       disabled
//                     />
//                   </Box>
//                 )}
//               </Box>
//             ))}
//           </Card>
//         </Box>
//       </Box>
//     </>
//   );
// }

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function BillingDetails() {
  const types = [
    {
      id: "1",
      value: "Water Reading",
    },
    { id: "2", value: "Meter Reading" },
  ];

  const rooms = [
    {
      id: "1",
      room: "101",
      meter: 0,
      water: 0,
      lastMeter: 200,
      lastWater: 333,
    },
    {
      id: "2",
      room: "102",
      meter: 0,
      water: 0,
      lastMeter: 890,
      lastWater: 33,
    },
    {
      id: "3",
      room: "103",
      meter: 0,
      water: 0,
      lastMeter: 999,
      lastWater: 38,
    },
    {
      id: "4",
      room: "201",
      meter: 0,
      water: 0,
      lastMeter: 257,
      lastWater: 38,
    },
    {
      id: "5",
      room: "202",
      meter: 0,
      water: 0,
      lastMeter: 20,
      lastWater: 3,
    },
    {
      id: "6",
      room: "203",
      meter: 0,
      water: 0,
      lastMeter: 20,
      lastWater: 3,
    },
    {
      id: "7",
      room: "302",
      meter: 0,
      water: 0,
      lastMeter: 20,
      lastWater: 3,
    },
  ];

  const [selectedType, setSelectedType] = useState(types[0].value);
  const [currentReadings, setCurrentReadings] = useState({});
  const [unitsDifference, setUnitsDifference] = useState({});
  const [costs, setCosts] = useState({});

  const calculateUnitDifference = (current, previous) => {
    return current - previous;
  };

  const calculateCost = (unitDifference, costPerUnit) => {
    return unitDifference * costPerUnit;
  };

  const handleCurrentReadingChange = (roomId, currentValue) => {
    // console.log("handleCurrentReadingChange", roomId, currentValue);
    // console.log(typeof roomId);
    const room = rooms.find((r) => r.id === roomId);
    // console.log(room);
    const isWaterReading = selectedType === "Water Reading";
    // Calculate unit difference and cost based on the reading type
    const unitDifference = calculateUnitDifference(
      currentValue,
      isWaterReading ? room.lastWater : room.lastMeter
    );
    console.log(unitDifference);
    const cost = calculateCost(
      unitDifference,
      selectedType === "Water Reading" ? 20 : 7
    );

    // Update the state with the current readings, units difference, and cost
    setCurrentReadings((prevReadings) => ({
      ...prevReadings,
      [roomId]: currentValue,
    }));
    setUnitsDifference((prevDifference) => ({
      ...prevDifference,
      [roomId]: unitDifference,
    }));
    setCosts((prevCosts) => ({
      ...prevCosts,
      [roomId]: cost,
    }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <Card sx={{ width: "100%", display: "flex", marginBottom: "10px" }}>
          <CardContent
            sx={{
              marginRight: "auto",
              marginBottom: "10px",
            }}
          >
            <Typography variant="h4">Billing Details</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Enter billing details for specific rooms
            </Typography>
          </CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "15px",
              width: "20%",
            }}
          >
            <Select
              label="Reading Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              variant="outlined"
              sx={{ width: "100%" }}
            >
              {types.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <Card
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {rooms.map((room) => (
              <Box key={room.id} sx={{ margin: "10px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ marginBottom: "10px" }} variant="h6">
                    Room {room.room}
                  </Typography>
                  <MoreVertIcon />
                </Box>

                {selectedType === "Meter Reading" && (
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <TextField
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      label={`Previous ${selectedType}`}
                      value={room.lastMeter}
                      disabled
                    />
                    <TextField
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      label={`Current ${selectedType}`}
                      value={currentReadings[room.id] || ""}
                      onChange={(e) =>
                        handleCurrentReadingChange(room.id, e.target.value)
                      }
                    />
                    <TextField
                      label="Units Difference"
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      value={unitsDifference[room.id] || ""}
                      disabled
                    />
                    <TextField
                      label="Cost"
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      value={costs[room.id] || 0}
                      disabled
                    />
                  </Box>
                )}
                {selectedType === "Water Reading" && (
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <TextField
                      label={`Previous ${selectedType}`}
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      value={room.lastWater}
                      disabled
                    />
                    <TextField
                      label={`Current ${selectedType}`}
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      value={currentReadings[room.id] || ""}
                      onChange={(e) =>
                        handleCurrentReadingChange(room.id, e.target.value)
                      }
                    />
                    <TextField
                      label="Units Difference"
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      value={unitsDifference[room.id] || ""}
                      disabled
                    />
                    <TextField
                      label="Cost"
                      type="number"
                      variant="outlined"
                      sx={{ width: "25%" }}
                      value={costs[room.id] || 0}
                      disabled
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Card>
        </Box>
      </Box>
    </>
  );
}
