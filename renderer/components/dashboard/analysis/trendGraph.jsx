import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Box, Grid, Paper, Button, Container } from "@mui/material";
import axios from "axios";

export default function TrendGraph() {
  const [selectedUtilityType, setSelectedUtilityType] = useState("water");
  const [selectedGranularity, setSelectedGranularity] = useState("building");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomLists, setRoomList] = useState([]);
  const [timeUnit, setTimeUnit] = useState("month");
  const [financialData, setFinancialData] = useState([]);
  const [yearsRange, setYearsRange] = useState(1);

  const [trends, setTrends] = useState(null);
  const chartRef = useRef(null);
  const financialRef = useRef(null);

  const [financialSummary, setFinancialSummary] = useState({
    revenue: null,
    costs: null,
    profit: null,
  });

  const fetchTrends = async (utilityType, granularity) => {
    try {
      const response = await axios.get(`http://localhost:3000/get_utitliy_trends/${utilityType.toLowerCase()}/${granularity.toLowerCase()}`);
      setTrends(response.data.data);
      console.log("Utility trends ", response.data.data);
    } catch (error) {
      console.error("Error Fetching utility trends", error);
    }
  };

  const fetchFinancialSummary = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getprofitandrevenue");
      setFinancialSummary(response.data.financialSummary);
      console.log("Financial Summary: ", response.data.financialSummary);
    } catch (error) {
      console.error("Error fetching financial summary", error);
    }
  };

  const fetchRoomList = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/getallrooms`);
      setRoomList(response.data.getrooms);
    } catch (error) {
      console.error("Error fetching rooms", error);
    }
  };

  const fetchFinancialTrends = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/getfinancialsummaryperiod?timeUnit=${timeUnit}&yearsRange=${yearsRange}`);
      let data = response.data.data;

      // Check if the time unit is "month" and filter data to only include the current year
      if (timeUnit === "month") {
        const currentYear = new Date().getFullYear();
        data = data.filter((d) => parseInt(d.year) === currentYear);
      }

      setFinancialData(data);
    } catch (error) {
      console.error("Error fetching financial trends", error);
    }
  };

  useEffect(() => {
    fetchTrends(selectedUtilityType, selectedGranularity);
    fetchFinancialSummary();
    fetchRoomList();
  }, [selectedUtilityType, selectedGranularity, selectedRoom]);

  useEffect(() => {
    fetchFinancialTrends();
  }, [timeUnit, yearsRange]);

  useEffect(() => {
    if (trends && chartRef.current) {
      import("danfojs")
        .then((dfd) => {
          const df = new dfd.DataFrame(trends);

          df["year"] = df["year"].apply((val) => parseInt(val));
          df["month"] = df["month"].apply((val) => parseInt(val));

          let traces = [];
          let grouped, sumDf, trace;

          if (selectedGranularity.toLowerCase() === "room" && selectedRoom) {
            if (!df.columns.includes("room_id")) {
              console.error("The dataframe does not contain 'room_id'. Data received:", trends);
              return;
            }
            let filteredDf = df.loc({ rows: df["room_id"].eq(parseInt(selectedRoom)) });
            grouped = filteredDf.groupby(["year", "month"]);
            sumDf = grouped.sum();
            trace = {
              x: sumDf["month"].values,
              y: sumDf["total_usage_sum"].values,
              type: "scatter",
              mode: "lines+markers",
              name: `Room ${selectedRoom}`,
              // name: `Year ${year}`,
            };
          } else {
            grouped = df.groupby(["year", "month"]);
            sumDf = grouped.sum();
            trace = {
              x: sumDf["month"].values,
              y: sumDf["total_usage_sum"].values,
              type: "scatter",
              mode: "lines+markers",
              name: "Total Building Usage",
              // name: `Year ${year}`,
            };
          }
          traces.push(trace);

          const layout = {
            title: "Utility Usage Trends",
            xaxis: { title: "Month/Year" },
            yaxis: { title: "Usage" },
            autosize: true,
            margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 100,
              pad: 4,
            },
          };

          import("plotly.js-dist-min")
            .then((plotly) => {
              plotly.newPlot(chartRef.current, traces, layout);
            })
            .catch((err) => console.error("Error loading Plotly:", err));
        })
        .catch((err) => console.error("Error loading Danfojs:", err));
    }
  }, [trends, selectedUtilityType, selectedGranularity, selectedRoom]);

  useEffect(() => {
    if (financialData.length > 0 && financialRef.current) {
      const profitTrace = {
        x: financialData.map((data) => (timeUnit === "month" ? `${data.month}-${data.year}` : data.year)),
        y: financialData.map((data) => data.profit),
        type: "scatter",
        mode: "lines+markers",
        name: "Profit",
      };

      const revenueTrace = {
        x: financialData.map((data) => (timeUnit === "month" ? `${data.month}-${data.year}` : data.year)),
        y: financialData.map((data) => data.revenue),
        type: "scatter",
        mode: "lines+markers",
        name: "Revenue",
      };

      const layout = {
        title: `Financial Comparison by ${timeUnit.toUpperCase()}`,
        xaxis: { title: timeUnit.toUpperCase() },
        yaxis: { title: "Amount" },
        autosize: true,
        margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
      };

      import("plotly.js-dist-min")
        .then((plotly) => {
          plotly.newPlot(financialRef.current, [profitTrace, revenueTrace], layout);
        })
        .catch((err) => console.error("Error loading Plotly:", err));
    }
  }, [financialData, timeUnit]);

  return (
    <>
      <Box sx={{ width: "100%", overflowX: "hidden", margin: 0 }}>
        <Container maxWidth={false}>
          <Paper elevation={3} sx={{ p: 4, marginTop: 4, width: "100%" }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h5" color="textSecondary" gutterBottom>
                    Revenue
                  </Typography>
                  <Typography variant="h4">${financialSummary.revenue?.toLocaleString() || "Loading..."}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h5" color="textSecondary" gutterBottom>
                    Costs
                  </Typography>
                  <Typography variant="h4">${financialSummary.costs?.toLocaleString() || "Loading..."}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h5" color="textSecondary" gutterBottom>
                    Profit
                  </Typography>
                  <Typography variant="h4">${financialSummary.profit?.toLocaleString() || "Loading..."}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Box sx={{ width: "63%" }}>
              <Typography variant="h5" gutterBottom>
                Utility Usage Trends
              </Typography>

              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="utility-type-label">Utility Type</InputLabel>
                    <Select labelId="utility-type-label" id="utility-type" value={selectedUtilityType} label="Utility Type" onChange={(e) => setSelectedUtilityType(e.target.value)}>
                      <MenuItem value="water">Water</MenuItem>
                      <MenuItem value="electricity">Electricity</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="granularity-label">Granularity</InputLabel>
                    <Select labelId="granularity-label" id="granularity" value={selectedGranularity} label="Granularity" onChange={(e) => setSelectedGranularity(e.target.value)}>
                      <MenuItem value="building">Building</MenuItem>
                      <MenuItem value="room">Room</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {selectedGranularity.toLowerCase() === "room" && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="room-select-label">Room</InputLabel>
                      <Select labelId="room-select-label" id="room-select" value={selectedRoom} label="Room" onChange={(e) => setSelectedRoom(e.target.value)}>
                        {roomLists.map((room, index) => (
                          <MenuItem key={index} value={room.room_id}>
                            {`Room ${room.room_number}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box ref={chartRef} sx={{ height: 500, width: "100%" }} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          <div>
            <Typography variant="h5" gutterBottom>
              Financial Trends
            </Typography>
            <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
            {timeUnit === "year" && <input type="number" value={yearsRange} onChange={(e) => setYearsRange(Number(e.target.value))} min="1" />}
            <div>
              <div ref={financialRef} style={{ height: 500, width: "100%" }} />
            </div>
          </div>
        </Container>
      </Box>
    </>
  );
}
