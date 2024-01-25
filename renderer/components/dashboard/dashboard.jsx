import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Button, Grid, Stack, Box } from "@mui/material";
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('management');
  const [slot, setSlot] = React.useState('month');
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
          {activeTab === 'management' && (
            // Render content for the 'Management' tab
            <div>
              <Card sx={{marginTop: '10px', height: '89%', width: '100%' }}>
                <CardContent >
                  <Typography variant="h5">Management Content</Typography>
                </CardContent>
              </Card>
              
            </div>
          )}



          {activeTab === 'analysis' && (
            // Render content for the 'Analysis' tab
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', marginBottom: '10px' }}>
              <Card sx={{ marginTop: '10px', height: '110px', width: '20%', marginRight: '2%' }}>
                <CardContent>
                  <Typography sx={{ textAlign: 'right', opacity: '60%', fontSize: '15px' }} variant="h6">Revenue</Typography>
                  <Typography sx={{ textAlign: 'center' }} variant="h5">$ 560,900</Typography>
                  <Typography sx={{ textAlign: 'center', color: 'green', marginTop: '5px' }} variant="h6">
                    +15% <ArrowUpwardIcon fontSize="small" />
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ marginTop: '10px', height: '110px', width: '20%', marginRight: '2%' }}>
                <CardContent>
                  <Typography sx={{ textAlign: 'right', opacity: '60%', fontSize: '15px' }} variant="h6">Cost</Typography>
                  <Typography sx={{ textAlign: 'center' }} variant="h5">$ 330,900</Typography>
                  <Typography sx={{ textAlign: 'center', color: 'red', marginTop: '5px' }} variant="h6">
                    -10% <ArrowDownwardIcon fontSize="small" />
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ marginTop: '10px', height: '110px', width: '20%' }}>
                <CardContent>
                  <Typography sx={{ textAlign: 'right', opacity: '60%', fontSize: '15px' }} variant="h6">Profit</Typography>
                  <Typography sx={{ textAlign: 'center' }} variant="h5">$ 229,900</Typography>
                  <Typography sx={{ textAlign: 'center', color: 'green', marginTop: '5px' }} variant="h6">
                    +8% <ArrowUpwardIcon fontSize="small" />
                  </Typography>
                </CardContent>
              </Card>
              </div>

              <div style={{ display: 'flex', marginBottom: '10px', width: '100%' }}>
              <Card sx={{ marginTop: 'auto', height: '110px', width: '64%' }}>
              <Grid item xs={12} md={7} lg={8}>
              <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: '10px' }}>
                <Grid item >
                  <Typography variant="h6">Unique Visitor</Typography>
                </Grid>
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={0}>
                    <Button
                      size="small"
                      onClick={() => setSlot('month')}
                      color={slot === 'month' ? 'primary' : 'secondary'}
                      variant={slot === 'month' ? 'outlined' : 'text'}
                    >
                      Month
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setSlot('week')}
                      color={slot === 'week' ? 'primary' : 'secondary'}
                      variant={slot === 'week' ? 'outlined' : 'text'}
                    >
                      Week
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              
              </Grid>
              </Card>
              <Card sx={{ marginTop: 'auto', height: '110px', width: '35%', marginLeft: '1%'}}>
              <Grid item xs={12} md={5} lg={4}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item sx={{ padding: '10px' }}>
                  <Typography variant="h6">Income Overview</Typography>
                </Grid>
                <Grid item />
              </Grid>
              
              </Grid>
              </Card>
              </div>
              <Card sx={{ marginTop: 'auto', height: '110px', width: '100%'}}>
              <Grid item xs={12} md={7} lg={8}>
              <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: '10px' }}>
                <Grid item>
                  <Typography variant="h6">Sales Report</Typography>
                </Grid>
                <Grid item>
                  
                </Grid>
              </Grid>
              
            </Grid>
            </Card>
            </div>
            

          )}
          
      
    </>
  );
}
