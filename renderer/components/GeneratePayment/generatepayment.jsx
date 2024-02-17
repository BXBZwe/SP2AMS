import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, CardContent, Typography, Checkbox, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

export default function PaymentTable() {
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationDates, setGenerationDates] = useState([]);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    { field: "room_number", headerName: "Room Number", width: 200 },
    { field: "tenant_name", headerName: "Tenant Name", width: 200 },
    { field: "total_bill", headerName: "Total Bill", width: 200 },
    { field: "payment_status", headerName: "Payment Status", width: 200 },
    {
      field: "checkbox",
      headerName: "CheckBox",
      width: 200,
      renderCell: (params) => <Checkbox checked={selectedRows.includes(params.id)} onChange={() => handleRowSelectionToggle(params.id)} />,
    },
  ];
  const fetchPaymentsdetails = async () => {
    if (!selectedGenerationDate) return;

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/getpaymentdetails", {
        params: {
          generationDate: selectedGenerationDate,
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

  useEffect(() => {
    if (selectedGenerationDate) {
      fetchPaymentsdetails();
    }
  }, [selectedGenerationDate]);

  const handleGenerationDateChange = (event) => {
    setSelectedGenerationDate(event.target.value);
  };

  const handleRowSelection = (ids) => {
    setSelectedRows(ids);
  };

  const handleRowSelectionToggle = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handleSendEmail = async () => {
    for (const rowId of selectedRows) {
      const paymentDetail = payments.find((payment) => payment.id === rowId);
      if (!paymentDetail) {
        console.error("Payment detail not found for id:", rowId);
        continue;
      }

      try {
        const response = await axios.post("http://localhost:3000/sendemail", {
          room_id: paymentDetail.room_id,
          subject: "Your Monthly Bill",
          message: "Please find your bill details attached.",
        });
        console.log("Email sent successfully for room:", paymentDetail.room_number);
      } catch (error) {
        console.error("Failed to send email for room:", paymentDetail.room_number, error);
      }
    }
  };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex" }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Payment Generation</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Send an E-payment slip or print a pdf
          </Typography>

          <select value={selectedGenerationDate} onChange={handleGenerationDateChange}>
            <option value="">Select Generation Date</option>
            {generationDates.map((date, index) => (
              <option key={index} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>
      <Card sx={{ marginTop: "10px" }}>
        <DataGrid rows={payments} getRowId={(row) => row.id} columns={columns} pageSize={5} pageSizeOptions={[5, 10]} onSelectionModelChange={handleRowSelection} selectionModel={selectedRows} />
      </Card>
      <Button variant="contained" color="primary" onClick={handleSendEmail} disabled={selectedRows.length === 0 || loading}>
        Send Emails
      </Button>
    </>
  );
}
