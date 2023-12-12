import * as React from 'react';
import Ratetable from '../components/ratemaintenance/ratetable';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {Card, CardContent, Typography, Box} from "@mui/material";
import Head from 'next/head'
import { DataGrid } from '@mui/x-data-grid';

export default function RateMaintenancePage() {
  const status = [
    { label: 'Booked' },
    { label: 'Not Booked' },
  ];
  const type = [
    { label: 'Studio'},
    { label: 'Wifi'},
    { label: 'Studio'},
  ];
  const rent = [
    { label: 'Available' },
    { label: 'Not Available' },
  ]
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const columns = [
    { field: 'id', headerName: 'Item ID', width: 130 },
    { field: 'itemid', headerName: 'Item Name', width: 160 },
    {
      field: 'fee',
      headerName: 'Fee',
      type: 'number',
      width: 100,
    },
    
  ];
  
  const rows = [
    { id: 'A001', itemid: 'Car Parking', fee: 35 },
    { id: 'A002', itemid: 'Furniture', fee: 42 },
    { id: 'A003', itemid: 'Fridge', fee: 45 },
    { id: 'A004', itemid: 'Air Con', fee: 16 },
    { id: 'A005', itemid: 'Air Con', fee: 200 },
    { id: 'A006', itemid: 'Air Con', fee: 150 },
    { id: 'A007', itemid: 'Air Con', fee: 44 },
    { id: 'A008', itemid: 'Air Con', fee: 36 },
    { id: 'A009', itemid: 'Air Con', fee: 65 },
  ];
  return (
    <>
    <Head>
    <title>Rate Maintenance</title>
    </Head>
    <Ratetable/>
    
    
   
    </>
  )
}
