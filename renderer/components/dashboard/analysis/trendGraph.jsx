import React, { useEffect, useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import { Card, CardContent, Button, Grid, Stack, Box } from "@mui/material";

import axios from "axios";

export default function TrendGraph() {
  const [selectedUtilityType, setSelectedUtilityType] = useState("water");
  const [selectedGranularity, setSelectedGranularity] = useState("building");

  const [trends, setTrends] = useState(null);
  const chartRef = useRef(null);

  const fetchTrends = async (utilityType, granularity) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get_utitliy_trends/${utilityType.toLowerCase()}/${granularity.toLowerCase()}`
      );
      setTrends(response.data.data);
      console.log("Utility trends ", response.data.data);
    } catch (error) {
      console.error("Error Fetching utility trends", error);
    }
  };

  useEffect(() => {
    fetchTrends(selectedUtilityType, selectedGranularity);
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
  }, [trends,selectedUtilityType, selectedGranularity]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <select
          value={selectedUtilityType}
          onChange={(e) => setSelectedUtilityType(e.target.value)}
        >
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
        </select>
        <select
          value={selectedGranularity}
          onChange={(e) => setSelectedGranularity(e.target.value)}
        >
          <option value="building">Building</option>
          <option value="room">Room</option>
        </select>
        <Card sx={{ marginTop: "10px", padding: "20px" }}>
          <div ref={chartRef} style={{ height: "500px", width: "100%" }} />
        </Card>
      </div>
    </>
  );
}
