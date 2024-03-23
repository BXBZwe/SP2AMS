import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Box, Grid, Paper, Button, Container } from "@mui/material";
import axios from "axios";

export default function TrendGraph() {
  const [selectedUtilityType, setSelectedUtilityType] = useState("water");
  const [selectedGranularity, setSelectedGranularity] = useState("building");

  const [trends, setTrends] = useState(null);
  const chartRef = useRef(null);

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
      setFinancialSummary(response.data);
      console.log("Financial Summary: ", response.data);
    } catch (error) {
      console.error("Error fetching financial summary", error);
    }
  };

  useEffect(() => {
    fetchTrends(selectedUtilityType, selectedGranularity);
    fetchFinancialSummary();
  }, [selectedUtilityType, selectedGranularity]);

  useEffect(() => {
    if (trends && chartRef.current) {
      import("danfojs")
        .then((dfd) => {
          const df = new dfd.DataFrame(trends);
          df["year"] = df["year"].apply((val) => parseInt(val));
          df["month"] = df["month"].apply((val) => parseInt(val));

          let traces = [];
          if (selectedGranularity.toLowerCase() === "room") {
            const roomIds = df["room_id"].unique().values;
            roomIds.forEach((roomId) => {
              const roomDf = df.loc({ rows: df["room_id"].eq(roomId) });
              const grouped = roomDf.groupby(["year", "month"]);
              const sumDf = grouped.sum();
              const trace = {
                x: sumDf["month"].values,
                y: sumDf["total_usage_sum"].values,
                type: "scatter",
                mode: "lines+markers",
                name: `Room ${roomId}`,
              };
              traces.push(trace);
            });
          } else {
            const grouped = df.groupby(["year", "month"]);
            const sumDf = grouped.sum();
            const trace = {
              x: sumDf["month"].values,
              y: sumDf["total_usage_sum"].values,
              type: "scatter",
              mode: "lines+markers",
              name: "Total Building Usage",
            };
            traces.push(trace);
          }

          const layout = {
            title: "Utility Usage Trends",
            xaxis: { title: "Month/Year" },
            yaxis: { title: "Usage" },
            autosize: false,
            width: 800,
            height: 500,
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
  }, [trends, selectedUtilityType, selectedGranularity]);

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
        </Container>
      </Box>
    </>
  );
}
