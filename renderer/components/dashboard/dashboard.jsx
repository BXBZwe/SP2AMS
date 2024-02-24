import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Button } from "@mui/material";
import Management from './management';
import Analysis from './analysis';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('management');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent
          sx={{
            marginRight: 'auto',
            marginBottom: '10px',
          }}
        >
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            03 Jan 2022 22:23
          </Typography>
        </CardContent>
        <CardContent>
          <div>
            <Button
              variant={activeTab === 'management' ? 'contained' : 'outlined'}
              onClick={() => handleTabChange('management')}
              sx={{ marginRight: '10px' }}
            >
              Management
            </Button>
            <Button
              variant={activeTab === 'analysis' ? 'contained' : 'outlined'}
              onClick={() => handleTabChange('analysis')}
            >
              Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Render Management or Analysis component based on activeTab */}
      {activeTab === 'management' && <Management />}
      {activeTab === 'analysis' && <Analysis />}
    </>
  );
}
