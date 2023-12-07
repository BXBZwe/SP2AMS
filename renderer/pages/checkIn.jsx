import * as React from 'react';
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
  InputAdornment,
} from "@mui/material";
import {
  MobileDatePicker,
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function CheckInPage() {
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

  const recentActivity = [
    {
      id: "R001",
      room: "101",
      date: "20 Tue 2022",
      status: "Move-In",
    },
    {
      id: "R002",
      room: "105",
      date: "20 Tue 2022",
      status: "Move-In",
    },
    {
      id: "R002",
      room: "102",
      date: "21 Wed 2022",
      status: "Move-Out",
    },
  ];
  

  const [selectedRoom, setSelectedRoom] = React.useState("");
  const [selectedTenant, setSelectedTenant] = React.useState("");
  const [contractMonths, setContractMonths] = React.useState("");
  const [deposit, setDeposit] = React.useState("");
  const [moveInDate, setMoveInDate] = React.useState(null);
  const [moveOutDate, setMoveOutDate] = React.useState(null);
  const [addButtonClicked, setAddButtonClicked] = React.useState(false);

  const handleMoveInDateChange = (date) => {
    setMoveInDate(date);
    if (moveOutDate && date > moveOutDate) {
      setMoveOutDate(date);
    }
  };

  const handleMoveOutDateChange = (date) => {
    if (moveInDate && date < moveInDate) {
      setMoveOutDate(moveInDate);
    } else {
      setMoveOutDate(date);
    }
  };

  // Clear Button Function
  const resetForm = () => {
    setSelectedRoom("");
    setSelectedTenant("");
    setContractMonths("");
    setDeposit("");
    setMoveInDate(null);
    setMoveOutDate(null);
    setAddButtonClicked(false); // Reset button state
  };

  // Add Button Function
  const handleAddButtonClick = () => {
    // Set button clicked state to true
    setAddButtonClicked(true);

    // Validate contractMonths and deposit
    const isContractMonthsValid = validateFloat(contractMonths) && contractMonths > 0;
    const isDepositValid = validateFloat(deposit) && deposit > 0;

    // Validate MoveIn and MoveOut
    const isMoveInValid = moveInDate !== null;
    const isMoveOutValid = moveOutDate !== null && moveOutDate > moveInDate;

    // If any validation fails, highlight the corresponding text field
    if (!isContractMonthsValid || !isDepositValid || !isMoveInValid || !isMoveOutValid) {
      return;
    }

    // If all validations pass, you can proceed with adding the data
    // Add your logic here
  };

  const validateFloat = (value) => {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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

                <Box sx={{ display: "flex", gap: "30px" }}>
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
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    Input Contract Details
                  </Typography>
                  <Box sx={{ display: "flex", gap: "20px" }}>
                    <Button variant="outlined" sx={{ width: "100%" }} onClick={resetForm}>
                      Clear
                    </Button>
                    <Button variant="contained" sx={{ width: "100%" }} onClick={handleAddButtonClick}>
                      Add
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <DatePicker
                    id="moveindateId"
                    label="Move In"
                    value={moveInDate}
                    onChange={handleMoveInDateChange}
                    sx={{ width: "40vw" }}
                  />
                  <Typography variant="h6" sx={{ margin: "0 10px" }}>
                    -
                  </Typography>
                  <DatePicker
                    id="moveoutdateId"
                    label="Move Out"
                    value={moveOutDate}
                    minDate={moveInDate} // Set minimum date for move-out
                    onChange={handleMoveOutDateChange}
                    sx={{ width: "40vw" }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                    gap: "30px",
                  }}
                >
                  <TextField
                    id="contractMonths"
                    label="Contract Months"
                    sx={{ width: "40vw" }}
                    value={contractMonths}
                    type="number"
                    error={addButtonClicked && (!validateFloat(contractMonths) || contractMonths <= 0)}
                    helperText={
                      addButtonClicked && (!validateFloat(contractMonths) || contractMonths <= 0)
                        ? "Contract months must be a positive number."
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">M</InputAdornment>
                      ),
                    }}
                    onChange={(e) => setContractMonths(e.target.value)}
                  />

                  <TextField
                    id="deposit"
                    label="Deposit"
                    sx={{ width: "40vw" }}
                    value={deposit}
                    type="number"
                    error={addButtonClicked && (!validateFloat(deposit) || deposit <= 0)}
                    helperText={
                      addButtonClicked && (!validateFloat(deposit) || deposit <= 0)
                        ? "Deposit must be a positive number."
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">THB</InputAdornment>
                      ),
                    }}
                    onChange={(e) => setDeposit(e.target.value)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Card sx={{ width: "38vw", marginLeft: "1vw" }}>
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                Total Fees
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    </LocalizationProvider>
  );
}



// import * as React from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   Divider,
//   TextField,
//   MenuItem,
//   InputAdornment,
// } from "@mui/material";
// import {
//   LocalizationProvider,
//   DatePicker,
// } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// const rooms = [
//   { value: "R102", label: "102" },
//   { value: "R101", label: "101" },
// ];

// const tenants = [
//   { value: "P1", label: "Yasi" },
//   { value: "P2", label: "Saw" },
// ];

// const CheckInPage = () => {
//   const [selectedRoom, setSelectedRoom] = React.useState("");
//   const [selectedTenant, setSelectedTenant] = React.useState("");
//   const [contractMonths, setContractMonths] = React.useState("");
//   const [deposit, setDeposit] = React.useState("");
//   const [moveInDate, setMoveInDate] = React.useState(null);
//   const [moveOutDate, setMoveOutDate] = React.useState(null);
//   const [addButtonClicked, setAddButtonClicked] = React.useState(false);

//   const handleMoveInDateChange = (date) => {
//     setMoveInDate(date && date > moveOutDate ? date : moveOutDate);
//   };

//   const handleMoveOutDateChange = (date) => {
//     setMoveOutDate(date && date < moveInDate ? moveInDate : date);
//   };

//   const resetForm = () => {
//     [setSelectedRoom, setSelectedTenant, setContractMonths, setDeposit, setMoveInDate, setMoveOutDate]
//       .forEach((setter) => setter(""));
//     setAddButtonClicked(false);
//   };

//   const handleAddButtonClick = () => {
//     setAddButtonClicked(true);

//     const isContractMonthsValid = validatePositiveNumber(contractMonths);
//     const isDepositValid = validatePositiveNumber(deposit);
//     const isMoveInValid = !!moveInDate;
//     const isMoveOutValid = moveOutDate && moveOutDate > moveInDate;

//     if (!isContractMonthsValid || !isDepositValid || !isMoveInValid || !isMoveOutValid) return;

//     // Add your logic here
//   };

//   const validatePositiveNumber = (value) => !isNaN(value) && parseFloat(value) > 0;

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div>
//         <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
//           <Typography variant="h4">Check-In</Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>Add New Tenants to the rooms they rent</Typography>
//           <Divider />
//         </Box>

//         <Box sx={{ display: "flex", justifyContent: "center" }}>
//           <Box>
//             <Card sx={{ width: "60vw", marginBottom: "10px" }}>
//               <CardContent>
//                 <Typography variant="h6" sx={{ marginBottom: "10px" }}>Select Room/Tenant</Typography>

//                 <Box sx={{ display: "flex", gap: "30px" }}>
//                   {[{ id: "roomId", label: "Room Number", state: selectedRoom, setState: setSelectedRoom, options: rooms },
//                     { id: "tenantId", label: "Tenant Name", state: selectedTenant, setState: setSelectedTenant, options: tenants }]
//                     .map((field) => (
//                       <TextField
//                         key={field.id}
//                         id={field.id}
//                         select
//                         label={field.label}
//                         value={field.state}
//                         onChange={(e) => field.setState(e.target.value)}
//                         sx={{ width: "40vw", marginBottom: "10px" }}
//                       >
//                         {field.options.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
//                         ))}
//                       </TextField>
//                     ))}
//                 </Box>
//               </CardContent>
//             </Card>
//             <Card sx={{ width: "60vw" }}>
//               <CardContent>
//                 <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                   <Typography variant="h6" sx={{ marginBottom: "10px" }}>Input Contract Details</Typography>
//                   <Box sx={{ display: "flex", gap: "20px" }}>
//                     <Button variant="outlined" sx={{ width: "100%" }} onClick={resetForm}>Clear</Button>
//                     <Button variant="contained" sx={{ width: "100%" }} onClick={handleAddButtonClick}>Add</Button>
//                   </Box>
//                 </Box>
//                 <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
//                   {[{ id: "moveindateId", label: "Move In", value: moveInDate, onChange: handleMoveInDateChange },
//                     { id: "moveoutdateId", label: "Move Out", value: moveOutDate, onChange: handleMoveOutDateChange, minDate: moveInDate }]
//                     .map((field) => (
//                       <DatePicker
//                         key={field.id}
//                         id={field.id}
//                         label={field.label}
//                         value={field.value}
//                         onChange={field.onChange}
//                         minDate={field.minDate}
//                         sx={{ width: "40vw" }}
//                       />
//                     ))}
//                 </Box>
//                 <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", gap: "30px" }}>
//                   {[{ id: "contractMonths", label: "Contract Months", state: contractMonths, setState: setContractMonths },
//                     { id: "deposit", label: "Deposit", state: deposit, setState: setDeposit }]
//                     .map((field) => (
//                       <TextField
//                         key={field.id}
//                         id={field.id}
//                         label={field.label}
//                         sx={{ width: "40vw" }}
//                         value={field.state}
//                         type="number"
//                         error={addButtonClicked && !validatePositiveNumber(field.state)}
//                         helperText={addButtonClicked && !validatePositiveNumber(field.state) ? `${field.label} must be a positive number.` : ""}
//                         InputProps={{ endAdornment: <InputAdornment position="end">{field.id === "deposit" ? "THB" : "M"}</InputAdornment> }}
//                         onChange={(e) => field.setState(e.target.value)}
//                       />
//                     ))}
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//           <Card sx={{ width: "38vw", marginLeft: "1vw" }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ marginBottom: "10px" }}>Recent Activity</Typography>
//               <Box sx={{ display: "flex", flexDirection: "column" }}>Total Fees</Box>
//             </CardContent>
//           </Card>
//         </Box>
//       </div>
//     </LocalizationProvider>
//   );
// };

// export default CheckInPage;
