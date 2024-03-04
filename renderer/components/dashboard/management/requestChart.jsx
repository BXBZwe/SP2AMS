import React, { useState, useEffect, useMemo } from "react";
import { useAPI } from "../../ratemaintenance/apiContent";
import { Card, Typography, LinearProgress, Box, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function RequestChart() {
  const { requests, fetchRequests } = useAPI();
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    fetchRequests();
    setLastUpdated(new Date().toLocaleString());
  }, [fetchRequests]);

  const { progress, unresolvedRequests } = useMemo(() => {
    const resolvedRequests = requests.filter(
      (request) => request.Request_status === "RESOLVED"
    ).length;
    const totalRequests = requests.length;
    const progressPercentage =
      totalRequests > 0 ? (resolvedRequests / totalRequests) * 100 : 0;

    const filteredRequests = requests
      .filter((request) => request.Request_status === "UNRESOLVED")
      .sort((a, b) => new Date(a.issue_date) - new Date(b.issue_date));

    return {
      progress: progressPercentage,
      unresolvedRequests: filteredRequests,
    };
  }, [requests]);

  const priorityColors = {
    URGENT: "error",
    HIGH: "warning",
    MODERATE: "info",
    NORMAL: "success",
    LOW: "default",
  };

  const columns = [
    {
      field: "room_number",
      headerName: "Room Number",
      flex: 0.1,
      valueGetter: (params) => params.row.roomBaseDetails.room_number,
    },
    {
      field: "Request_priority",
      headerName: "Priority",
      flex: 0.1,
      renderCell: (params) => {
        const color = priorityColors[params.value] || "default";
        return (
          <Chip
            label={params.value}
            color={color}
            size="small"
            variant="outlined"
            style={{
              width: "100%", // set the width to 100% to fill the cell
              justifyContent: "center", // center the text inside the chip
            }}
          />
        );
      },
    },
  ];

//   console.log(requests)
  return (
    <div>
      <Card sx={{ padding: "20px",width:'100%' }}>
        <Typography variant="h6">Request Progress</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={unresolvedRequests.slice(0, 5)} 
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.request_id}
            autoHeight
            hideFooterPagination 
          />
        </div>

        {/* <Typography variant="caption">Last Updated: {lastUpdated}</Typography> */}
      </Card>
    </div>
  );
}
