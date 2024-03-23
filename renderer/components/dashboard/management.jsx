import React, { useState, useEffect } from "react";
import axios from "axios";
import OccupancyPie from "./management/occupancyPie";
import RequestChart from "./management/requestChart";
import PaymentStatus from "./management/paymentStatus"; // Adjust this if PaymentStatus still needs to be used
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

// Define StatusSummaryCard component here for clarity
const StatusSummaryCard = ({ title, count, color }) => (
  <Grid item xs={12} sm={6} md={3} lg={3}>
    <Card sx={{ padding: "20px", minWidth: "220px", textAlign: "center", boxShadow: 3 }}>
      <Typography variant="h4" style={{ color: color, marginBottom: "10px" }}>
        {count}
      </Typography>
      <Typography variant="h6" style={{ color: color }}>
        {title}
      </Typography>
    </Card>
  </Grid>
);


// Main Management component
export default function Management() {
  const [generationDates, setGenerationDates] = useState([]);
  const [payments, setPayments] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenerationDates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getgenerationdate");
        if (response.data && Array.isArray(response.data.dates)) {
          setGenerationDates(response.data.dates);
        } else {
          console.error("Generation dates response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch generation dates:", error);
      }
    };

    fetchGenerationDates();
  }, []);

  useEffect(() => {
    const fetchPaymentDetails = async (latestDate) => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/getpaymentdetails", {
          params: { generationDate: latestDate },
        });
        if (response.data && Array.isArray(response.data.paymentDetails)) {
          setPayments(response.data.paymentDetails);
        } else {
          console.error("Payment details response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (generationDates.length > 0) {
      const sortedDates = [...generationDates].sort((a, b) => new Date(b) - new Date(a));
      const latestDate = sortedDates[0];
      fetchPaymentDetails(latestDate);
    }
  }, [generationDates]);

  useEffect(() => {
    const newStatusCounts = payments.reduce((acc, payment) => {
      const status = payment.payment_status || 'Null';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    setStatusCounts(newStatusCounts);
  }, [payments]);

  return (
    <>
  <Box sx={{
  display: "flex",
  flexDirection: 'row',
  height: '100%',
  marginTop: "20px",
  width: "100%",
  justifyContent: "center"
}}>
  <Box sx={{
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    marginRight: ["0", "20px"], // Remove margin on small screens
    flex: "0 1 auto" // Allows this box to grow and shrink as needed
  }}>
    <Box sx={{ display: "flex", gap: "20px" }}>
      {['PAID', 'PENDING', 'OVERDUE', 'PARTIAL'].map((status) => {
        let color = '';
        switch (status) {
          case 'PAID': color = '#66bb6a'; break;
          case 'PENDING': color = '#ffa726'; break;
          case 'OVERDUE': color = '#ef5350'; break;
          case 'PARTIAL': color = '#42a5f5'; break;
          default: color = '#757575'; // Default color for undefined status
        }
        return <StatusSummaryCard key={status} title={status} count={statusCounts[status] || 0} color={color} />;
      })}
    </Box>
    
    <Card sx={{ display: "flex", marginTop: '20px' }}>
      <PaymentStatus />
      <OccupancyPie />
    </Card>
  </Box>
  <Card sx={{
    width:'100%',
    justifyContent: 'flex-end',
    maxHeight: "100%",
    
  }}>
    <CardContent>
      <RequestChart />
    </CardContent>
  </Card>
</Box>
      
    </>
  );
}
