import React, { useEffect, useState,useRef } from "react";
import { Card, Box, Typography } from "@mui/material";
import axios from "axios";

export default function PaymentStatus() {
    const chartRef = useRef(null);
  const [payments, setPayments] = useState([]);
  const [generationDates, setGenerationDates] = useState([]);
  const [loading, setLoading] = useState(false); // Assuming you have a loading state

  const fetchGenerationDates = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getgenerationdate");
      if (response.data && Array.isArray(response.data.dates)) {
        setGenerationDates(response.data.dates);
      } else {
        console.error("Generation dates response is not an array:", response.data);
        setGenerationDates([]);
      }
    } catch (error) {
      console.error("Failed to fetch generation dates:", error);
    }
  };

  useEffect(() => {
    fetchGenerationDates();
  }, []);

  const fetchPaymentDetails = async (latestDate) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/getpaymentdetails", {
        params: {
          generationDate: latestDate,
        },
      });
      if (response.data && Array.isArray(response.data.paymentDetails)) {
        setPayments(response.data.paymentDetails);
      } else {
        console.error("Payment details response is not an array:", response.data);
        setPayments([]);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (generationDates.length > 0) {
      const sortedDates = [...generationDates].sort((a, b) => new Date(b) - new Date(a));
      const latestDate = sortedDates[0];
      fetchPaymentDetails(latestDate);
    }
  }, [generationDates]);

  useEffect(() => {
    if (payments && chartRef.current) {
      // Count occurrences of each payment status
      const statusCounts = payments.reduce((acc, payment) => {
        const status = payment.payment_status || 'Null'; // Default to 'Null' if status is undefined
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
  
      const labels = Object.keys(statusCounts);
      const values = Object.values(statusCounts);
  
      // Dynamically import Plotly inside useEffect
      import('plotly.js-dist-min').then(({ default: Plotly }) => {
        const data = [{
          values: values,
          labels: labels,
          type: 'pie',
          hole: .4,
          textinfo: "percent",
          insidetextorientation: "radial",
          marker: {
            // Define your color mapping for different payment statuses
            colors: labels.map(label => {
              switch (label) {
                case 'PAID': return '#66bb6a'; 
                case 'PENDING': return '#ffa726'; 
                case 'OVERDUE': return '#ef5350'; 
                case 'PARTIAL': return '#42a5f5'; 
                default: return '#bdbdbd'; 
              }
            })
          }
        }];
  
        const layout = {
          title: "Payment Status Distribution",
          showlegend: true
        };
  
        Plotly.newPlot(chartRef.current, data, layout);
      }).catch(err => {
        console.error("Error loading Plotly:", err);
      });
    }
  }, [payments]); 
  


  

  console.log("Payment details", payments);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Card sx={{  padding: "20px", width: "fit-content", position: "relative" }}> {/* Ensure position is relative */}
        <div ref={chartRef} style={{ height: "500px", width: "500px" }} />
        {/* <Box sx={{ position: 'absolute', bottom: 0, left: 0, padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="caption">
            Last Updated: {lastUpdated}
          </Typography>
        </Box> */}
      </Card>
    </div>
  );
}
