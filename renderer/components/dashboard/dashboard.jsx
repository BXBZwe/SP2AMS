import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button, Stack } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PersonIcon from '@mui/icons-material/Person';

// Sample data for the table
const initialContacts = [
  { id: 1, name: 'John Doe', field: 'Marketing' },
  { id: 2, name: 'Jane Smith', field: 'Development' },
  { id: 3, name: 'William Johnson', field: 'Design' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('management');
  const [slot, setSlot] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState(initialContacts);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.field.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
        <Grid container spacing={2} sx={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">Room Status</Typography>
                {/* Content for Box 1 */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Request Page</Typography>
                {/* Content for Box 2 */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">Recent Payment</Typography>
                {/* Content for Box 3 */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Contacts</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search contacts..."
                  margin="normal"
                  onChange={handleSearchChange}
                />
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Person</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Field</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredContacts.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <PersonIcon />
                          </TableCell>
                          <TableCell align="right">{row.name}</TableCell>
                          <TableCell align="right">{row.field}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 'analysis' && (
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
            <Card sx={{ marginTop: 'auto', height: '110px', width: '35%', marginLeft: '1%' }}>
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
          <Card sx={{ marginTop: 'auto', height: '110px', width: '100%' }}>
            <Grid item xs={12} md={7} lg={8}>
              <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: '10px' }}>
                <Grid item>
                  <Typography variant="h6">Sales Report</Typography>
                </Grid>
                <Grid item />
              </Grid>
            </Grid>
          </Card>
        </div>
      )}
    </>
  );
}
