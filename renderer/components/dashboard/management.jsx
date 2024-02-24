import React from "react";
import Typography from "@mui/material/Typography";
import { Card, CardContent } from "@mui/material";
import Roomstatus from "./managementComponents/roomstatus";
export default function Management() {
  return (
    <div>
      <Card sx={{ marginTop: "10px", height: "89%", width: "100%" }}>
        <CardContent>
          <Typography variant="h5">Room Status</Typography>
          <Roomstatus />
        </CardContent>
      </Card>
    </div>
  );
}
