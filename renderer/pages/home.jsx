// // pages/index.js

// import React from "react";
// import Head from "next/head";
// import { useRouter } from "next/router";
// import SignIn from "../components/auth/signIn";
// import Dashboard from "@mui/icons-material/Dashboard";
// export default function HomePage() {
//   const router = useRouter();

//   const handleLogin = () => {
//     // Handle the login logic, e.g., setting user authentication state
//     // For simplicity, you can just navigate to the /dashboard page
//     router.push("/dashboard");
//   };

//   const isLoggedIn =
//   typeof window !== "undefined" &&
//   localStorage.getItem("isLoggedIn") === "true";

//   return (
//     <React.Fragment>
//       <Head>
//         <title>Home</title>
//       </Head>
//       {!isLoggedIn ? <SignIn onLogin={handleLogin}: <Dashboard/> />
// }
//     </React.Fragment>
//   );
// }


// pages/index.js

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
        <title>Home</title>
      </Head>
      {/* {isLoggedIn ? <Dashboard /> : <SignIn/>} */}
      <Dashboard />
    </React.Fragment>
  );
}



