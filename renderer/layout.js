import React from 'react';
import Nav from './components/Nav';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Nav />
      <main style={{ flex: 1}}>{children}</main>
    </div>
  );
};

export default Layout;
