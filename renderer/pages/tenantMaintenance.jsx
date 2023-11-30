import React from "react";
import Head from "next/head";
import { Card, CardContent, Typography } from "@mui/material";

export default function TenantMaintenancePage() {
  return (
    <>
      <Head>
        <title>Tenant Maintenance</title>
      </Head>
      <Card>
        <CardContent>
          <Typography>Tenant Page</Typography>
        </CardContent>
      </Card>
    </>
  );
}
