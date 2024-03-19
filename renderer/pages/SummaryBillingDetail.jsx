import React from "react";
import Head from "next/head";

import RoomDetailsTable from "../components/SummaryBilling/summarybillingtable";
export default function SummaryBilling() {
  return (
    <div>
      <Head>
        <title>Summary Billing Details</title>
      </Head>

      <RoomDetailsTable />
    </div>
  );
}
