import React from 'react';

const Nav = () => {
  const dummyLinks = ['Home', 'About', 'Services', 'Contact'];

  return (
    <div
      style={{
        width: '40%',
        height: '100vh', // Set height to 100vh to take up the whole viewport height
        backgroundColor: '#f0f0f0', // Set background color as needed
      }}
    >
      <h2>Navigation</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {dummyLinks.map((link, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>
            <a href="/home">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
