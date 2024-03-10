import React from "react";
import Head from "next/head";
import { Typography } from "@mui/material";
import PeriodicBillingReport from "../components/billingreport/periodicbillingreport";
export default function Summaryaccuralbilling() {
  return (
    <div>
      <Head></Head>
      <PeriodicBillingReport />
    </div>
  );
}
