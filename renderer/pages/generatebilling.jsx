import React from 'react'
import Head from 'next/head'
import { Typography } from '@mui/material'
import GenerateBill from '../components/GenerateBilling/GenerateBill'

export default function generatebilling() {
  return (
    <>
      <Head>
        <title>Generate Bill</title>
      </Head>
      <GenerateBill />
    </>
  )
}
