import React from "react";
import Head from "next/head";
import { Typography } from "@mui/material";
import ContractTable from "../components/GenerateContract/generatecontract";

export default function generatecontract() {
  return (
    <div>
      <Head>
        <title>generatecontract</title>
      </Head>
      <ContractTable></ContractTable>
    </div>
  );
}
