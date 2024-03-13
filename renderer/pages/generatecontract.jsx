import React from "react";
import Head from "next/head";
import { Typography } from "@mui/material";
import ContractTable from "../components/GenerateContract/generatecontract";

export default function generatecontract() {
  return (
    <div>
      <Head>
        <title>Generate Contract</title>
      </Head>
      <ContractTable/>
    </div>
  );
}
