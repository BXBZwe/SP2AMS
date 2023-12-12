import * as React from "react";
import CheckIn from "../components/checkIn/CheckIn";

export default function CheckInPage() {
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
