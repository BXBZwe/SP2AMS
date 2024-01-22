import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Roomtable from '../components/ratemaintenance/roomtable';
import axios from 'axios';


export default function RoomMaintenancePage  ()  {
  return (
    <>
      <Head>
        <title>Room Maintenance</title>
      </Head>
      <Roomtable />

    </>
  );
}

