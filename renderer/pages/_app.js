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

// import Layout from "../layout";

// export default function MyApp({ Component, pageProps }) {
//   const handleLogin = () => {
//     // Implement your login logic here
//     console.log("User logged in");
//   };

//   const handleLogout = () => {
//     // Implement your logout logic here
//     console.log("User logged out");
//     localStorage.removeItem('isLoggedIn');
//   };

//   return (
//     // <Layout onLogin={handleLogin} onLogout={handleLogout}>
//     <Layout>
//       <Component {...pageProps} />
//     </Layout>
//   );
// }

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../layout';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const publicPages = ['/signin'];
    const pathIsProtected = !publicPages.includes(router.pathname);

    if (status === "loading") return;

    if (!session && pathIsProtected) {
      router.push('/signin');
    }

    if (session && router.pathname === '/signin') {
      router.replace('/home');
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return session ? (
    <Layout>{children}</Layout>
  ) : (
    children
  );
}

export default MyApp;



