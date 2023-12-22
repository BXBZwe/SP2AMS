// //_app.js
// import Layout from "../layout";

// export default function MyApp({ Component, pageProps }) {
//   return (
//     <Layout>
//       <Component {...pageProps} />
//     </Layout>
//   );
// }


// _app.js

import Layout from "../layout";

export default function MyApp({ Component, pageProps }) {
  const handleLogin = () => {
    // Implement your login logic here
    console.log("User logged in");
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("User logged out");
    localStorage.removeItem('isLoggedIn');
  };

  return (
    // <Layout onLogin={handleLogin} onLogout={handleLogout}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
