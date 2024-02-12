import * as React from 'react';
import Ratetable from '../components/ratemaintenance/ratetable';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {Card, CardContent, Typography, Box} from "@mui/material";
import Head from 'next/head'
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbarContext } from '../components/snackBar/SnackbarContent';

export default function RateMaintenancePage() {
  const {
    snackbar: { open, message, severity },
    closeSnackbar,
  } = useSnackbarContext();

  
  return (
    <>
    <Head>
    <title>Rate Maintenance</title>
    </Head>
    <Snackbar open={open} autoHideDuration={4000} onClose={closeSnackbar}  anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    <Ratetable/>
    
    
   
    </>
  )
}
