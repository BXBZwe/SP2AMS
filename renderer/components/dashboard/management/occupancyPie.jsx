import React, { useEffect } from "react";
import { Card } from "@mui/material";
import { useAPI } from "../../ratemaintenance/apiContent";
// import { DataFrame } from "danfojs-nightly"; 
import { DataFrame } from "danfojs";
export default function OccupancyPie() {
  const { rooms, fetchRooms } = useAPI();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms) {
      // Extract occupancy_status into a flat array, ensuring undefined statuses are handled
      const occupancyStatuses = rooms.map(room => room.statusDetails?.occupancy_status || 'UNDEFINED');

      // Manually count the occurrences of each status
      const statusCounts = occupancyStatuses.reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Convert the counts object into an array of objects for DataFrame
      const dataForDF = Object.keys(statusCounts).map(status => ({
        Status: status,
        Count: statusCounts[status]
      }));

      // Create a DataFrame with the correct column names
      const df = new DataFrame(dataForDF, { columns: ["Status", "Count"] });

      // Plot the pie chart
      df.plot("plot_div").pie({
        config: {
          values: "Count",
          labels: "Status",
          title: "Room Occupancy Status"
        }
      });
    }
  }, [rooms]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Card sx={{ marginTop: "10px", padding: "20px", width: "fit-content" }}>
        <div id="plot_div" style={{ height: "500px", width: "500px" }}></div>
      </Card>
    </div>
  );
}
