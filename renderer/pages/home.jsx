import React, { useEffect } from "react";
import Head from "next/head";
import Dashboard from "../components/dashboard/dashboard";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // If not logged in, redirect to the sign-in page
    if (!isLoggedIn) {
      router.push("../components/auth/signin"); // Assuming your sign-in page is the root page
    }
  }, [router]);

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
