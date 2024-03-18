import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

export default function PaymentTable() {
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = useTheme();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationDates, setGenerationDates] = useState([]);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const columns = [
    { field: "room_number", headerName: "Room Number", width: 200 },
    { field: "tenant_name", headerName: "Tenant Name", width: 300 },
    { field: "total_bill", headerName: "Total Bill", width: 200 },
    { field: "payment_status", headerName: "Payment Status", width: 200 },
    {
      field: "checkbox",
      headerName: "",
      width: 200,
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.id)}
          onChange={() => handleRowSelectionToggle(params.id)}
        />
      ),
    },
  ];
  const fetchPaymentsdetails = async () => {
    if (!selectedGenerationDate) return;

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/getpaymentdetails",
        {
          params: {
            generationDate: selectedGenerationDate,
          },
        }
      );
      if (response.data && Array.isArray(response.data.paymentDetails)) {
        setPayments(response.data.paymentDetails);
        console.log("Responmse",response.data)
      } else {
        console.error(
          "Payment details response is not an array:",
          response.data
        );
        setPayments([]);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenPdfDialog = () => {
    setOpenPdfDialog(true);
  };
  // const handleGeneratePdfAndClose = async () => {
  //   console.log("Generating PDF for selected rows:", selectedRows);

  //   for (const rowId of selectedRows) {
  //     const paymentDetail = payments.find((payment) => payment.id === rowId);
  //     if (!paymentDetail) {
  //       // console.error("Payment detail not found for id:", rowId);
  //       continue;
  //     }

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:3000/generate-pdf",
  //         {
  //           room_id: paymentDetail.room_id,
  //         },
  //         { responseType: "blob" }
  //       );

  //       const pdfBlob = new Blob([response.data], { type: "application/pdf" });

  //       const pdfUrl = URL.createObjectURL(pdfBlob);

  //       window.open(pdfUrl);

  //       console.log("PDF generated successfully for room:", paymentDetail.room_number);
  //     } catch (error) {
  //       console.error("Failed to generate PDF for room:", paymentDetail.room_number, error);
  //     }
  //   }

  //   setOpenPdfDialog(false);
  // };

  const handleGeneratePdfAndClose = async () => {
    const roomIds = selectedRows
      .map((rowId) => {
        const paymentDetail = payments.find((payment) => payment.id === rowId);
        return paymentDetail.room_id;
      })
      .filter((roomId) => roomId != null);

    if (roomIds.length > 0) {
      try {
        const response = await axios.post(
          "http://localhost:3000/generate-pdf-multiple",
          { room_ids: roomIds },
          { responseType: "blob" }
        );

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);

        // const link = document.createElement("a");
        // link.href = pdfUrl;
        // link.setAttribute("download", `payment_details.pdf`); // or any other filename
        // document.body.appendChild(link);
        // link.click();
        // link.parentNode.removeChild(link);

        console.log("PDF generated successfully for selected rooms.");
      } catch (error) {
        console.error("Failed to generate PDF for selected rooms:", error);
      }
    } else {
      console.log("No rooms selected for PDF generation.");
    }

    setOpenPdfDialog(false);
  };

  const fetchGenerationDates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getgenerationdate"
      );
      if (response.data && Array.isArray(response.data.dates)) {
        setGenerationDates(response.data.dates);
        const sortedDates = [...response.data.dates].sort((a, b) => new Date(b) - new Date(a));
        setGenerationDates(sortedDates); // Update the state with sorted dates
        setSelectedGenerationDate(sortedDates[0]); // Set the latest date as default
      } else {
        console.error(
          "Generation dates response is not an array:",
          response.data
        );
        // setGenerationDates([]);
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
  const handleSendEmailAndClose = async () => {
    setOpenSnackbar(true);
    setOpenDialog(false);
    const success = await handleSendEmail();
    if (success) {
      setOpenSnackbar(true);
      setOpenDialog(false);
    }
  };

  const handleSendEmail = async () => {
    console.log("Sending emails to selected rows:", selectedRows);
    for (const rowId of selectedRows) {
      const paymentDetail = payments.find((payment) => payment.id === rowId);
      if (!paymentDetail) {
        // console.error("Payment detail not found for id:", rowId);
        continue;
      }

      try {
        const response = await axios.post("http://localhost:3000/sendemail", {
          room_id: paymentDetail.room_id,
          subject: "Your Monthly Bill",
          message: "Please find your bill details attached.",
        });
        console.log(
          "Email sent successfully for room:",
          paymentDetail.room_number
        );
      } catch (error) {
        console.error(
          "Failed to send email for room:",
          paymentDetail.room_number,
          error
        );
      }
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  console.log('Payments',payments)
  return (
    <>
      <Card sx={{ width: "100%", display: "flex" }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ width: "70%" }}>
            <Typography variant="h4">Payment Generation</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, marginBottom: 1 }}>
              Send an E-payment slip or print a pdf
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              disabled={selectedRows.length === 0 || loading}
            >
              Send Emails
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPdfDialog}
              disabled={selectedRows.length === 0 || loading}
              sx={{ ml: 2 }}
            >
              Generate PDF
            </Button>
          </Box>

          <Box sx={{ width: "30%" }}>
            {" "}
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Generation Date</InputLabel>
              <Select
                value={selectedGenerationDate}
                onChange={handleGenerationDateChange}
                label="Select Generation Date"
              >
                {generationDates.map((date, index) => (
                  <MenuItem key={index} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ marginTop: "10px" }}>
        <DataGrid
          rows={payments}
          getRowId={(row) => row.id}
          columns={columns}
          pageSize={5}
          pageSizeOptions={[5, 10]}
          onSelectionModelChange={handleRowSelection}
          selectionModel={selectedRows}
          sx={{
            "& .MuiDataGrid-main": { maxHeight: "70vh" },
          }}
          autoHeight
          density="compact"
          rowHeight={80}
        />
      </Card>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title" sx={{ textAlign: "center" }}>
          Choose Your Option
        </DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSendEmailAndClose}
            color="primary"
          >
            Payment
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(false)}
            color="primary"
          >
            Receipt
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPdfDialog}
        onClose={() => setOpenPdfDialog(false)}
        aria-labelledby="pdf-dialog-title"
      >
        <DialogTitle id="pdf-dialog-title">Confirm PDF Generation</DialogTitle>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleGeneratePdfAndClose}
            color="primary"
          >
            Generate PDF
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenPdfDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Email sent successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
