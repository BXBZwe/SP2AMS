import React from "react";
import Head from "next/head";
import { Typography } from "@mui/material";
import BillingDetails from "../components/billingDetails/BillingDetails";
export default function billingdetails() {
  return (
    <div>
      <Head>
        <title>Billing Details</title>
      </Head>
      <BillingDetails />
    </div>
  );
}
