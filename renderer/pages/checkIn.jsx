import * as React from "react";
import CheckIn from "../components/checkIn/CheckIn";
import Head from "next/head";
export default function CheckInPage() {
  return (
    <>
      <Head>
        <title>Check In</title>
      </Head>
      <CheckIn />
    </>
  );
}
