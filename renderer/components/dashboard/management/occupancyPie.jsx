// import React, { useEffect, useRef } from "react";
// import { Card } from "@mui/material";
// import { useAPI } from "../../ratemaintenance/apiContent";
// import Plotly from 'plotly.js-dist-min';

// export default function OccupancyPie() {
//   const { rooms, fetchRooms } = useAPI();
//   const chartRef = useRef(null);

//   useEffect(() => {
//     fetchRooms();
//   }, [fetchRooms]);

//   useEffect(() => {
//     if (rooms && chartRef.current) {
//       const occupancyStatuses = rooms.map(room => room.statusDetails?.occupancy_status || 'UNDEFINED');

//       const statusCounts = occupancyStatuses.reduce((acc, status) => {
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//       }, {});

//       const labels = Object.keys(statusCounts);
//       const values = Object.values(statusCounts);
//       const total = values.reduce((a, b) => a + b, 0); // Calculate total

//       // Adding the total count to the legend
//       const customLabels = labels.map(label => `${label}: ${statusCounts[label]}`);
//       customLabels.push(`Total: ${total}`);

//       const data = [{
//         values: values,
//         labels: customLabels,
//         type: 'pie',
//         hole: .4,
//         textinfo: "percent",
//         insidetextorientation: "radial",
//         marker: {
//           colors: ['#4caf50', '#ffeb3b', '#f44336'] // Example colors for 'VACANT', 'UNAVAILABLE', 'OCCUPIED'
//         }
//       }];

//       const layout = {
//         title: "Room Status",
//         showlegend: true
//       };

//       Plotly.newPlot(chartRef.current, data, layout);
//     }
//   }, [rooms]);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//       <Card sx={{ marginTop: "10px", padding: "20px", width: "fit-content" }}>
//         <div ref={chartRef} style={{ height: "500px", width: "500px" }} />
//       </Card>
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { Card, Box, Typography } from "@mui/material";
import { useAPI } from "../../ratemaintenance/apiContent";

export default function OccupancyPie() {
  const { rooms, fetchRooms } = useAPI();
  const chartRef = useRef(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    fetchRooms();
    const now = new Date();
    setLastUpdated(now.toLocaleString());
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms && chartRef.current) {
      const occupancyStatuses = rooms.map((room) => room.statusDetails?.occupancy_status || "UNDEFINED");
      const statusCounts = occupancyStatuses.reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(statusCounts);
      const values = Object.values(statusCounts);
      const total = values.reduce((a, b) => a + b, 0);

      // Dynamically import Plotly inside useEffect
      import("plotly.js-dist-min")
        .then(({ default: Plotly }) => {
          const customLabels = labels.map((label) => `${label}: ${statusCounts[label]}`);
          const data = [
            {
              values: values,
              labels: customLabels,
              type: "pie",
              hole: 0.4,
              textinfo: "percent",
              insidetextorientation: "radial",
              marker: {
                colors: ["#66bb6a", "#ffa726", "#ef5350"], // These colors are placeholders
              },
            },
          ];

          const layout = {
            title: "Room Status",
            showlegend: true,
            annotations: [
              {
                font: {
                  size: 16,
                },
                showarrow: false,
                text: `Total: ${total}`,
                x: 0.5,
                y: 0.5,
              },
            ],
          };

          Plotly.newPlot(chartRef.current, data, layout);
        })
        .catch((err) => {
          console.error("Error loading Plotly:", err);
        });
    }
  }, [rooms]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div ref={chartRef} style={{ height: "400px", width: "420px" }} />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
        <Typography variant="caption">Last Updated: {lastUpdated}</Typography>
      </Box>
    </div>
  );
}
