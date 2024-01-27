import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Roomtable from '../components/ratemaintenance/roomtable';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbarContext } from '../components/snackBar/SnackbarContent';

export default function RoomMaintenancePage  ()  {
  const {
    snackbar: { open, message, severity },
    closeSnackbar,
  } = useSnackbarContext();

  return (
    <>
      <Head>
        <title>Room Maintenance</title>
      </Head>
      <Snackbar open={open} autoHideDuration={4000} onClose={closeSnackbar}  anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Roomtable />

    </>
  );
}

