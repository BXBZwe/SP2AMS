import React, { useState, useEffect, createContext } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout';
import { SnackbarProvider } from "../components/snackBar/SnackbarContent";
import { APIProvider } from "../components/ratemaintenance/apiContent";
import theme from '../theme';
import { ThemeProvider } from '@mui/material';

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => { },
});

function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionInfo = localStorage.getItem('sessionInfo');
      setIsLoggedIn(!!sessionInfo);
    }
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const sessionInfo = localStorage.getItem('sessionInfo');
      setIsLoggedIn(!!sessionInfo);
    };

    checkSession();
    router.events.on('routeChangeComplete', checkSession);

    return () => {
      router.events.off('routeChangeComplete', checkSession);
    };
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <SnackbarProvider>
          <APIProvider>
            <AuthWrapper>
              <Component {...pageProps} />
            </AuthWrapper>
          </APIProvider>
        </SnackbarProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

function AuthWrapper({ children }) {
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log('isLoggedIn useEffect triggered', isLoggedIn);
    if (!isLoggedIn && router.pathname !== '/signin') {
      console.log('Not logged in, redirecting to signin');
      router.push('/signin');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    console.log('Checking if we should redirect away from signin', isLoggedIn);
    if (isLoggedIn && router.pathname === '/signin') {
      console.log('Logged in, redirecting to home');
      router.push('/home');
    }
  }, [isLoggedIn, router]);

  if (router.pathname === '/signin' && isLoggedIn) {
    console.log('Already logged in, should not show signin page');
    return null;
  }

  return <Layout>{children}</Layout>;
}

export default MyApp;
