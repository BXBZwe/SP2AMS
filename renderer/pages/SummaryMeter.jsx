import React from 'react'
import Head from 'next/head'

import SummaryMeters from '../components/summarymeter/SummaryMeters';
export default function SummaryMeter() {
  return (
    <div>
            <Head>
        <title>SummaryMeter</title>
      </Head>
      
      <SummaryMeters/>
    </div>
  )
}
