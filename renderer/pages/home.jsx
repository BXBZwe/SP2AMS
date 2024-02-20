import React from "react";
import Head from "next/head";
import Dashboard from "../components/dashboard/dashboard";

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Dashboard />
    </React.Fragment>
  );
}

// export async function getServerSideProps(context) {
//   console.log("Cookies in getServerSideProps:", context.req.headers.cookie);
//   const session = await getSession(context);
//   console.log("Session in getServerSideProps:", session);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/signin",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// }
