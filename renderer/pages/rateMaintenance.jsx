import * as React from 'react';
import Ratetable from '../components/ratemaintenance/ratetable';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {Card, CardContent, Typography, Box} from "@mui/material";
import Head from 'next/head'
import { DataGrid } from '@mui/x-data-grid';

export default function RateMaintenancePage() {
  
  return (
    <>
    <Head>
    <title>Rate Maintenance</title>
    </Head>
    <Ratetable/>
    
    
   
    </>
  )
}
