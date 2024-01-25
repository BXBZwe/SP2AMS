import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import SignIn from "../components/auth/signIn";
import Dashboard from "../components/dashboard/dashboard";

export default function HomePage() {
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  return (
    <React.Fragment>
      <Head>
        <title>Dashboard</title>
      </Head>
      {/* {isLoggedIn ? <Dashboard /> : <SignIn/>} */}
      <Dashboard />
    </React.Fragment>
  );
}