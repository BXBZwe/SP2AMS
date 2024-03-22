// import React, { useEffect, useState,useRef } from "react";
// import { Card, Box, Typography } from "@mui/material";
// import axios from "axios";

// export default function PaymentStatus() {
//     const chartRef = useRef(null);
//   const [payments, setPayments] = useState([]);
//   const [generationDates, setGenerationDates] = useState([]);
//   const [loading, setLoading] = useState(false); // Assuming you have a loading state

//   const fetchGenerationDates = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/getgenerationdate");
//       if (response.data && Array.isArray(response.data.dates)) {
//         setGenerationDates(response.data.dates);
//       } else {
//         console.error("Generation dates response is not an array:", response.data);
//         setGenerationDates([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch generation dates:", error);
//     }
//   };

//   useEffect(() => {
//     fetchGenerationDates();
//   }, []);

//   const fetchPaymentDetails = async (latestDate) => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:3000/getpaymentdetails", {
//         params: {
//           generationDate: latestDate,
//         },
//       });
//       if (response.data && Array.isArray(response.data.paymentDetails)) {
//         setPayments(response.data.paymentDetails);
//       } else {
//         console.error("Payment details response is not an array:", response.data);
//         setPayments([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch payments:", error);
//       setPayments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (generationDates.length > 0) {
//       const sortedDates = [...generationDates].sort((a, b) => new Date(b) - new Date(a));
//       const latestDate = sortedDates[0];
//       fetchPaymentDetails(latestDate);
//     }
//   }, [generationDates]);

//   useEffect(() => {
//     if (payments && chartRef.current) {
//       // Count occurrences of each payment status
//       const statusCounts = payments.reduce((acc, payment) => {
//         const status = payment.payment_status || 'Null'; // Default to 'Null' if status is undefined
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//       }, {});
  
//       const labels = Object.keys(statusCounts);
//       const values = Object.values(statusCounts);
  
//       // Dynamically import Plotly inside useEffect
//       import('plotly.js-dist-min').then(({ default: Plotly }) => {
//         const data = [{
//           values: values,
//           labels: labels,
//           type: 'pie',
//           hole: .4,
//           textinfo: "percent",
//           insidetextorientation: "radial",
//           marker: {
//             // Define your color mapping for different payment statuses
//             colors: labels.map(label => {
//               switch (label) {
//                 case 'PAID': return '#66bb6a'; 
//                 case 'PENDING': return '#ffa726'; 
//                 case 'OVERDUE': return '#ef5350'; 
//                 case 'PARTIAL': return '#42a5f5'; 
//                 default: return '#bdbdbd'; 
//               }
//             })
//           }
//         }];
  
//         const layout = {
//           title: "Payment Status Distribution",
//           showlegend: true
//         };
  
//         Plotly.newPlot(chartRef.current, data, layout);
//       }).catch(err => {
//         console.error("Error loading Plotly:", err);
//       });
//     }
//   }, [payments]); 
  


  

//   console.log("Payment details", payments);
//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//       <Card sx={{  padding: "20px", width: "fit-content", position: "relative" }}> {/* Ensure position is relative */}
//         <div ref={chartRef} style={{ height: "500px", width: "500px" }} />
//       </Card>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import { Card, Box, Typography } from "@mui/material";
import axios from "axios";

export default function PaymentStatus() {
  const chartRef = useRef(null);
  const [payments, setPayments] = useState([]);
  const [generationDates, setGenerationDates] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (chartRef.current) {
      if (payments.length === 0) {
        // If there are no payments, show "No Payments"
        chartRef.current.innerHTML = "<p>No Payments</p>";
      } else {
        // Count occurrences of each payment status
        const statusCounts = payments.reduce((acc, payment) => {
          const status = payment.payment_status || 'Null';
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
            showlegend: true,
            annotations: [
              {
                font: {
                  size: 16
                },
                showarrow: false,
                text: `No Payments`,
                x: 0.5,
                y: 0.5
              }
            ]
          };

          Plotly.newPlot(chartRef.current, data, layout);
        }).catch(err => {
          console.error("Error loading Plotly:", err);
        });
      }
    }
  }, [payments]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Card sx={{ padding: "20px", width: "fit-content", position: "relative" }}>
        <div ref={chartRef} style={{ height: "500px", width: "500px" }} />
      </Card>
    </div>
  );
}
