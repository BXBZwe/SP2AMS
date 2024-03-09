import React from 'react'
import Head from 'next/head'
import { Typography } from '@mui/material'
import SummaryBilling from '../components/billingreport/billingreport';
export default function Summarybilling() {
  return (
    <div>
      <Head>
        <title>Summarybilling</title>
      </Head>
      <SummaryBilling />
      
    </div>
  )
}
