// import Nav from "./components/Nav";

// const Layout = ({ children }) => {
//   return (
//     <div style={{ display: 'flex' }}>
//       <Nav />
//       <main style={{ flex: 1, padding: '20px' }}>
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;

// layout.js

// import Nav from "./components/Nav";

// const Layout = ({ children }) => {
//   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

//   return (
//     <div style={{ display: 'flex' }}>
//       {isLoggedIn || isLoggedInSession && <Nav />}
//       <main style={{ flex: 1, padding: '20px' }}>
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;


// layout.js

import React from "react";
import Nav from "./components/Nav";
import { SnackbarProvider } from "./components/snackBar/SnackbarContent";

const Layout = ({ children }) => {
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  return (
    <div style={{ display: "flex" }}>
      {/* {isLoggedIn && <Nav />} */}
      <Nav />
      <SnackbarProvider>
        <main style={{ flex: 1, padding: "20px" }}>
          {children}
        </main>
      </SnackbarProvider>
    </div>
  );
};

export default Layout;
