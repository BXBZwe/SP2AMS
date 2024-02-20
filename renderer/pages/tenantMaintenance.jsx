import React from "react";
import Head from "next/head";
import Tenanttable from '../components/ratemaintenance/tenanttable';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbarContext } from '../components/snackBar/SnackbarContent';



export default function TenantMaintenancePage() {
  
  const {
    snackbar: { open, message, severity },
    closeSnackbar,
  } = useSnackbarContext();

  return (
    <>
      <Head>
        <title>Tenant Maintenance</title>
      </Head>
      <Snackbar open={open} autoHideDuration={4000} onClose={closeSnackbar}  anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Tenanttable />
      
    </>
  );
}
