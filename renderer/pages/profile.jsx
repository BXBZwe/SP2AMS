import * as React from 'react';
import {Card, CardContent, Typography, Box, Button, Input} from "@mui/material";
import Head from 'next/head'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, green } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';





export default function profile() {
  
  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      
      <Card sx={{ width: '100%'}}>
        <CardContent
        sx={{
          marginRight: "auto",
          marginBottom: "10px",  
        }}
        >
        <Typography variant="h4">Profile</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Manage Profile and Email Settings
        </Typography>
      </CardContent>
      <Box sx={{display: 'flex'}}>
      
      <CardContent sx={{display: 'inline-block'}}>
        <Stack direction="row" spacing={2}>
        <Avatar sx={{ bgcolor: deepOrange[500], width: 210, height: 210 }} variant="square">
          Ahmad
        </Avatar>
        
      </Stack>

    
    </CardContent>
    <CardContent >
       <Typography variant="h7"><b>Name <EditIcon sx={{width: 18}} /></b></Typography>
       <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Ahmad Yasi Faizi
        </Typography>
        <Typography variant="h7"><b>Email <EditIcon sx={{width: 18}} /></b></Typography>
       <Typography variant="body2" sx={{ opacity: 0.7 }}>
            yasifaizi10@gmail.com
        </Typography>
        <Typography variant="h7"><b>Website <EditIcon sx={{width: 18}} /></b></Typography>
       <Typography variant="body2" sx={{ opacity: 0.7 }}>
            www.Abac.au
        </Typography>
        <Typography variant="h7"><b>Telephone <EditIcon sx={{width: 18}} /></b></Typography>
       <Typography variant="body2" sx={{ opacity: 0.7 }}>
          +66 08237123 
        </Typography>
       </CardContent>
       </Box>
       
      </Card>
      <Card sx={{marginTop: 2}}>
        <CardContent>
          <Typography variant="h6"><b>Change Password</b></Typography>
      <form>   
      <Stack spacing={1}>
        <Input placeholder="***************" disabled sx={{marginTop: '1', display: 'block'}}/>
        <Input placeholder="***************" disabled sx={{marginTop: '1'}}/>
        <Input placeholder="***************" disabled sx={{marginTop: '1'}}/>
        
      </Stack>
      </form>
        </CardContent>
      </Card>
      
    </div>
  )
}
