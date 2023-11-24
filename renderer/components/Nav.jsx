import React from 'react';
import Link from 'next/link';
import {Card,Fab,CardContent} from '@mui/material';

const Nav = () => {
  const navigationItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Rate Maintenance', link: '/rateMaintenance' },
    { label: 'Room Maintenance', link: '/roomMaintenance' },
    { label: 'Tenant Maintenance', link: '/tenantMaintenance' },
    { label: 'Check-In', link: '/checkIn' },
    { label: 'Check-Out', link: '/checkOut' },
  ];

  return (
    <div
      style={{
        width: '25%',
        height: '100vh',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Card>
        <CardContent>
          PS Park
        </CardContent>
      </Card>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {navigationItems.map((item, index) => (
          <li key={index} style={{ marginBottom: '8px', textDecoration: 'none' }}>
            <Link href={item.link}>
              <a style={{ textDecoration: 'none' }}>{item.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
