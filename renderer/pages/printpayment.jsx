import React from "react";
import Head from "next/head";
import PaymentTable from "../components/GeneratePayment/generatepayment";
export default function printpayment() {
  return (
    <div>
      <Head>
        <title>Print Payment</title>
      </Head>
      <PaymentTable/>
    </div>
  );
}
