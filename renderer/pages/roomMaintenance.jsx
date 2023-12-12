import * as React from 'react';
import Head from 'next/head'
import Roomtable from '../components/ratemaintenance/roomtable';

export default function RoomMaintenancePage() {
  
  return (
    <>
      <Head>
        <title>Room Maintenance</title>
      </Head>
      <Roomtable />
      
    </>
  );
}
