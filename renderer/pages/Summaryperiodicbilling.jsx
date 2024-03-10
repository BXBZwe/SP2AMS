import React from "react";
import Head from "next/head";
import { Typography } from "@mui/material";
import AccuralBillingReport from "../components/billingreport/accuralbillingreport";
export default function Summaryperiodicbilling() {
  return (
    <div>
      <Head></Head>
      <AccuralBillingReport />
    </div>
  );
}
