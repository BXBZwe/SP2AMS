// import React, { useEffect, useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import Typography from '@mui/material/Typography';
// import { Button, Card, CardContent, IconButton, InputAdornment, TextField, MenuItem, Select } from "@mui/material";
// import Link from 'next/link';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import axios from 'axios';

// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// const columns = [
//   { field: 'id', headerName: 'Room ID', width: 130 },
//   { field: 'roomnumber', headerName: 'Room Number', width: 170 },
//   { field: 'floor', headerName: 'Floor', width: 150 },
//   { field: 'roomtype', headerName: 'Room Type', width: 170 },
//   { field: 'roomstatus', headerName: 'Room Status', width: 150 },
  
//   { field: 'startdate', headerName: 'Contract Start Date', width: 170 },
//   { field: 'enddate', headerName: 'End Date', width: 130 },
  
//   {
//     field: 'action',
//     headerName: 'Action',
//     width: 150,
//     renderCell: (params) => (
//       <div>
//         <Link href="roommaintenance/addroom" passHref>
//           <IconButton onClick={() => handleEdit(params.row.id)}>
//             <EditIcon />
//           </IconButton>
//         </Link>
//         <IconButton onClick={() => handleDelete(params.row.id)}>
//           <DeleteIcon />
//         </IconButton>
//       </div>
//     ),
//   },
// ];

// const rows = [
//   { id: 'A001', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A002', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A003', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A004', roomnumber: 'A001', floor: '1', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A005', roomnumber: 'A001', floor: '1', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
//   { id: 'A006', roomnumber: 'A001', floor: '2', roomstatus: 'Available', startdate: '-', enddate: '-' },
//   { id: 'A007', roomnumber: 'A001', floor: '2', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
//   { id: 'A008', roomnumber: 'A001', floor: '2', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
//   { id: 'A009', roomnumber: 'A001', floor: '2', roomstatus: 'Occupied', startdate: '23/01/2023', enddate: '01/23/2024' },
// ];

// const handleEdit = (roomId) => {
//   // Implement the edit logic here
//   console.log(`Edit room with ID ${roomId}`);
// };

// const handleDelete = (roomId) => {
//   // Implement the delete logic here
//   console.log(`Delete room with ID ${roomId}`);
// };

// export default function ratetable() {
//   const [searchText, setSearchText] = React.useState('');
//   const [filterValue, setFilterValue] = React.useState('all');
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/getallrooms');
//         const roomsData = response.data;
    
//           setRooms(roomsData.getrooms);
  
//       } catch (error) {
//         console.error('Error fetching rooms:', error.message);
//       }
//     };
  
//     fetchRooms();
//   }, []);
  
//   console.log('Fetched Data',rooms[0]);
//   console.log('Rows',rows[0]);

//   // const filteredRows = React.useMemo(() => {
//   //   return rows.filter(row => (
//   //     row.roomnumber.toLowerCase().includes(searchText.toLowerCase()) ||
//   //     row.apartment.toLowerCase().includes(searchText.toLowerCase()) ||
//   //     row.roomstatus.toLowerCase().includes(searchText.toLowerCase())
//   //   ) && (filterValue === 'all' || row.roomstatus === filterValue)
//   //   );
//   // }, [searchText, filterValue]);

//   const filteredRows = React.useMemo(() => {
//     return rooms.filter(row => (
//       row.room_number.toLowerCase().includes(searchText.toLowerCase()) ||
//       row.room_type.toLowerCase().includes(searchText.toLowerCase()) ||
//       row.roomstatus.toLowerCase().includes(searchText.toLowerCase())
//     ) && (filterValue === 'all' || row.roomstatus === filterValue)
//     );
//   }, [searchText, filterValue]);


//   return (
//     <>
//       <Card sx={{ width: '100%', display: 'flex' }}>
//         <CardContent
//           sx={{
//             marginRight: "auto",
//             marginBottom: "10px",
//           }}
//         >
//           <Typography variant="h4">Room Maintenance</Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//             Remove or Relocate tenants corresponding to their room settings
//           </Typography>
//         </CardContent>
//         <CardContent>
//           <Link href="roommaintenance/addroom" passHref>
//             <Button
//               variant="contained"
//               sx={{ width: "60px", marginTop: '15px' }}
//               component="a"
//             >
//               Add
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//       <Card sx={{  marginTop: '10px' }}>
//         <CardContent >
//         <div style={{ display: 'flex', marginBottom: '10px' }}>
//           <TextField
//             label="Search"
//             variant="outlined"
//             fullWidth
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
            
//             sx={{ marginRight: '10px', width: '80%' }}
//           />
//           <Select
//             value={filterValue}
//             onChange={(e) => setFilterValue(e.target.value)}
//             displayEmpty
//             inputProps={{ 'aria-label': 'Filter' }}
//             sx={{width: '20%'}}
            
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="Available">Available</MenuItem>
//             <MenuItem value="Occupied">Occupied</MenuItem>
//           </Select></div>
//           <div style={{ height: '89%', width: '100%' }}>
//             <DataGrid
//               rows={filteredRows}
//               columns={columns}
//               pageSize={5}
//               pageSizeOptions={[5, 10]}
//               checkboxSelection
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </>
//   );
// }


import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, TextField, Select, MenuItem } from "@mui/material";
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router'

const columns = [
  { field: 'roomnumber', headerName: 'Room Number', width: 120 },
  { field: 'floor', headerName: 'Floor', width: 120 },
  { field: 'roomtype', headerName: 'Room Type', width: 120 },
  { field: 'occupancystatus', headerName: 'Occupancy', width: 120 },
  { field: 'reservationstatus', headerName: 'Reservation', width: 120 },
  { field: 'paymentstatus', headerName: 'Payment', width: 250 },
];

// const totalColumns = 6; // Total number of columns
// const columnWidth = `${100 / totalColumns}%`; // Calculate equal width for each column

// const columns = [
//   { field: 'roomnumber', headerName: 'Room Number', width: columnWidth },
//   { field: 'floor', headerName: 'Floor', width: columnWidth },
//   { field: 'roomtype', headerName: 'Room Type', width: columnWidth },
//   { field: 'occupancystatus', headerName: 'Occupancy', width: columnWidth },
//   { field: 'reservationstatus', headerName: 'Reservation', width: columnWidth },
//   { field: 'paymentstatus', headerName: 'Payment', width: columnWidth },
// ];

export default function ratetable() {
  const [rooms, setRooms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  const router = useRouter();

  const handleRowClick = (params) => {
    // Extract the id from the clicked row's data
    const roomId = params.row.id;
    // console.log('Room Table',roomId);

    // Use Next.js router to navigate to the details page
    router.push(`/roommaintenance/editroom?roomId=${roomId}`);

  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getallrooms');
        // console.log(response.data.getrooms)
        const roomsData = response.data.getrooms.map(room => ({
          id: room.room_id,
          roomnumber: room.room_number,
          floor: room.floor,
          roomtype: room.room_type,
          occupancystatus: room.statusDetails.occupancy_status,
          reservationstatus: room.statusDetails.is_reserved,
          paymentstatus: room.statusDetails.payment_status
        }));
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };
  
    fetchRooms();
  }, []);


  const filteredRows = rooms.filter(row => {
    return (
      row.roomnumber.toLowerCase().includes(searchText.toLowerCase()) &&
      (filterValue === 'all' || row.occupancystatus === filterValue)
    );
  });

  useEffect(() => {

    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getallrooms')
        const rooms = await response.data;
        console.log('Fetched rooms:', rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };
    
  fetchRooms();
  }, []);

  return (
    <>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Room Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            View and manage room settings
          </Typography>
        </CardContent>
        <CardContent>
          <Link href="roommaintenance/addroom" passHref>
            <Button
              variant="contained"
              sx={{ width: "60px", marginTop: '15px' }}
              component="a"
            >
              Add
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Card sx={{ marginTop: '10px' }}>
        <CardContent>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <TextField
              label="Search Room ID or Number"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ marginRight: '10px', width: '70%' }}
            />
            <Select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Filter' }}
              sx={{width: '30%'}}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
              {/* Add other status options here as needed */}
            </Select>
          </div>
          <div style={{ height: '89%', width: '100%' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowClick={handleRowClick}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
