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
import { useRouter } from "next/router";


const Layout = ({ children }) => {
  const router = useRouter();
  // Check if we are on a page where the Nav should not be displayed
  const noNavRoutes = ['/signin'];
  const showNav = !noNavRoutes.includes(router.pathname);

  return (
    <div style={{ display: "flex" }}>
      {showNav && <Nav />}
      <SnackbarProvider>
        <main style={{ flex: 1, padding: "20px" }}>
          {children}
        </main>
      </SnackbarProvider>
    </div>
  );
};

export default Layout;
