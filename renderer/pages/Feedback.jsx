import React, { useState } from "react";
import Head from "next/head";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import RequestTable from "../components/request/requesttable";

export default function Feedback() {
  return (
    <div>
      <Head>
        <title>Requests</title>
      </Head>
      <RequestTable />
    </div>
  );
}
