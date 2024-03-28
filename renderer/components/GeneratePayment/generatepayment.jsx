import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, Tab, Tabs, CardContent, Typography, Checkbox, Dialog, DialogActions, DialogTitle, FormControl, InputLabel, Select, MenuItem, Box, DialogContent, TextField, DialogContentText, Autocomplete } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

export default function PaymentTable() {
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationDates, setGenerationDates] = useState([]);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [openUpdatePaymentDialog, setOpenUpdatePaymentDialog] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Function to open the snackbar with a message and a severity
  const handleOpenSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity); // Could be "success", "error", "warning", or "info"
    setOpenSnackbar(true);
  };

  useEffect(() => {
    switch (selectedTab) {
      case 0: // GenerateBill
        setFilteredPayments(payments.filter((payment) => payment.payment_status === "Null"));
        break;
      case 1: // Pending
        setFilteredPayments(payments.filter((payment) => payment.payment_status === "PENDING"));
        break;
      case 2: // Paid
        setFilteredPayments(payments.filter((payment) => payment.payment_status === "PAID"));
        break;
      default:
        // Other
        setFilteredPayments(payments.filter((payment) => payment.payment_status !== "Null" && payment.payment_status !== "PENDING" && payment.payment_status !== "PAID"));
    }
  }, [selectedTab, payments]);

  // console.log("Selected tab: " + selectedTab,payments);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedRows([]);
    setSelectedRooms([]);
  };
  const columns = [
    { field: "room_number", headerName: "Room Number", flex: 0.2 },
    { field: "tenant_name", headerName: "Tenant Name", flex: 0.2 },
    { field: "total_bill", headerName: "Total Bill ฿", flex: 0.2 },
    { field: "payment_status", headerName: "Payment Status", flex: 0.2 },
    {
      field: "checkbox",
      headerName: "",
      flex: 0.2,
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

  const handleGeneratePdf = async () => {
    // Filter roomIds based on invoice_option
    const roomIds = selectedRows
      .map((rowId) => {
        const paymentDetail = payments.find((payment) => payment.id === rowId);
        if (paymentDetail && (paymentDetail.invoice_option === "PAPER" || paymentDetail.invoice_option === "BOTH")) {
          return paymentDetail.room_id;
        }
        return null;
      })
      .filter((roomId) => roomId != null); // Ensure that only valid roomIds are included

    if (roomIds.length > 0) {
      try {
        const response = await axios.post("http://localhost:3000/generate-pdf-multiple", { room_ids: roomIds }, { responseType: "blob" });

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);

        // console.log("PDF generated successfully for selected rooms.");
        handleOpenSnackbar("PDF generated successfully for selected rooms.", "success");
      } catch (error) {
        console.error("Failed to generate PDF for selected rooms:", error);
      }
    } else {
      // console.log("No rooms selected for PDF generation.");
    }

    setOpenPdfDialog(false);
  };

  const handleGeneratePaidInvoicePdf = async () => {
    // Filter roomIds based on invoice_option
    // console.log("Paid Invoice")
    const roomIds = selectedRows
      .map((rowId) => {
        const paymentDetail = payments.find((payment) => payment.id === rowId);
        if (paymentDetail && (paymentDetail.invoice_option === "PAPER" || paymentDetail.invoice_option === "BOTH")) {
          return paymentDetail.room_id;
        }
        return null;
      })
      .filter((roomId) => roomId != null); // Ensure that only valid roomIds are included

    if (roomIds.length > 0) {
      try {
        const response = await axios.post("http://localhost:3000/generateinvoice-pdf-multiple", { room_ids: roomIds }, { responseType: "blob" });

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);

        // console.log("PDF generated successfully for selected rooms.");
        handleOpenSnackbar("PDF generated successfully for selected rooms.", "success");
      } catch (error) {
        console.error("Failed to generate PDF for selected rooms:", error);
      }
    } else {
      // setOpenSnackbar(true);
      //   setSnackbarMessage(
      //     "Please select a room!"
      //   );
      // handleOpenSnackbar("Please select a room!", "error")
      // console.log("No rooms selected for PDF generation.");
    }

    setOpenPdfDialog(false);
  };

  const fetchGenerationDates = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getgenerationdate");
      if (response.data && Array.isArray(response.data.dates)) {
        setGenerationDates(response.data.dates);
        const sortedDates = [...response.data.dates].sort((a, b) => new Date(b) - new Date(a));
        setGenerationDates(sortedDates); // Update the state with sorted dates
        setSelectedGenerationDate(sortedDates[0]); // Set the latest date as default
      } else {
        console.error("Generation dates response is not an array:", response.data);
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
    setSelectedRows([]);
    setSelectedRooms([]);
  };

  const handleRowSelection = (ids) => {
    setSelectedRows(ids);
  };

  const handleRowSelectionToggle = (id) => {
    setSelectedRows((prevSelectedRows) => {
      let newSelectedRows;
      if (prevSelectedRows.includes(id)) {
        // If the row is already selected, remove it
        newSelectedRows = prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        // If the row is not selected, add it
        newSelectedRows = [...prevSelectedRows, id];
      }

      // Update selectedRoomIds based on newSelectedRows
      const newSelectedRoomIds = newSelectedRows.map((rowId) => {
        // Find the room details corresponding to the rowId in filteredContracts
        // console.log(rowId);
        const roomDetails = payments.find((contract) => contract.id === rowId);
        return roomDetails.room_number; // Assuming each contract object has a room_id field
      });

      // Update the selectedRoomIds state
      setSelectedRooms(newSelectedRoomIds);

      return newSelectedRows;
    });
  };

  const handleAllPaymentGenerate = async () => {
    setOpenGenerateDialog(false);
    const emailSuccess = await handleSendEmail();
    const pdfSuccess = await handleGeneratePdf();
    const updateSuccess = await handleUpdatePaymentStatus();

    if (emailSuccess || (pdfSuccess && updateSuccess)) {
      // setOpenSnackbar(true);
      // // Set a message to indicate all operations were successful
      // setSnackbarMessage(
      //   "Emails sent, PDFs generated, and payment statuses updated successfully."
      // );

      handleOpenSnackbar("Emails sent, PDFs generated, and payment statuses updated successfully.", "success");
    }
  };

  const handleGenerateReciept = async () => {
    if (selectedRows.length === 0) {
      handleOpenSnackbar("Please select at least one room to proceed.", "error");
      return; // Exit the function early
    }
    setOpenGenerateDialog(false);
    const emailSuccess = await handleSendEmail();
    const pdfSuccess = await handleGeneratePdf();

    if (pdfSuccess && emailSuccess) {
      // setOpenSnackbar(true);
      // setSnackbarMessage(
      //   "Reciept PDFs generated,updated successfully."
      // );

      handleOpenSnackbar("Reciept PDFs generated,updated successfully.", "success");
    }
  };

  // Invoice Email /sendemail-invoice
  const handleAllPaidPaymentInvoiceGenerate = async () => {
    setOpenGenerateDialog(false);

    // Check if no rooms are selected
    if (selectedRows.length === 0) {
      handleOpenSnackbar("Please select at least one room to proceed.", "error");
      return; // Exit the function early
    }

    // Proceed with generating PDFs and sending emails if rooms are selected
    const pdfSuccess = await handleGeneratePaidInvoicePdf();
    const emailSuccess = await handleSendEmailInvoice();

    // Show success message if both operations succeed
    if (pdfSuccess && emailSuccess) {
      handleOpenSnackbar("Invoice PDFs and emails sent successfully.", "success");
    }
  };

  const handleUpdatePaymentStatus = async () => {
    const rowsToUpdate = selectedRows
      .filter((rowId) => {
        const paymentDetail = payments.find((payment) => payment.id === rowId);
        return paymentDetail && paymentDetail.payment_status === "Null";
      })
      .map((rowId) => payments.find((payment) => payment.id === rowId).id);

    if (rowsToUpdate.length > 0) {
      try {
        await axios.put("http://localhost:3000/updatepaymentstatus", {
          billIds: rowsToUpdate, // Send an array of roomIds to update
        });
        await fetchPaymentsdetails();
        return true;
      } catch (error) {
        console.error("Failed to update payment statuses for selected rooms:", error);
        return false;
      }
    }
    return true; // Return true if there's nothing to update
  };

  const handleSendEmail = async () => {
    let emailSuccess = true; // Initialize success flag
    // console.log("Sending emails to selected rows:", selectedRows);

    // Filter selected rows by invoice option
    const emailRows = selectedRows.filter((rowId) => {
      const paymentDetail = payments.find((payment) => payment.id === rowId);
      return paymentDetail && (paymentDetail.invoice_option === "EMAIL" || paymentDetail.invoice_option === "BOTH");
    });

    for (const rowId of emailRows) {
      const paymentDetail = payments.find((payment) => payment.id === rowId);
      if (!paymentDetail) continue; // Skip if no payment detail found

      try {
        await axios.post("http://localhost:3000/sendemail", {
          room_id: paymentDetail.room_id,
          subject: "Your Monthly Bill",
          message: "Please find your bill details attached.",
        });
        // setOpenSnackbar(true);
        handleOpenSnackbar("Email Sent", "success");

        // console.log("Email sent successfully for room:", paymentDetail.room_number);
      } catch (error) {
        console.error("Failed to send email for room:", paymentDetail.room_number, error);
        emailSuccess = false; // Update success flag on failure
      }
    }

    return emailSuccess; // Return the overall success status
  };

  const handleSendEmailInvoice = async () => {
    let emailSuccess = true; // Initialize success flag
    // console.log("Sending emails to selected rows:", selectedRows);

    // Filter selected rows by invoice option
    const emailRows = selectedRows.filter((rowId) => {
      const paymentDetail = payments.find((payment) => payment.id === rowId);
      return paymentDetail && (paymentDetail.invoice_option === "EMAIL" || paymentDetail.invoice_option === "BOTH");
    });

    for (const rowId of emailRows) {
      const paymentDetail = payments.find((payment) => payment.id === rowId);
      if (!paymentDetail) continue; // Skip if no payment detail found

      const invoice_date = new Date().toLocaleDateString("en-US");
      try {
        await axios.post("http://localhost:3000/sendemail-invoice", {
          room_id: paymentDetail.room_id,
          subject: `Your Invoice ${invoice_date}`,
          message: "Please find your bill details attached.",
        });
        // setOpenSnackbar(true);
        handleOpenSnackbar("Email Sent", "success");

        // console.log("Email sent successfully for room:", paymentDetail.room_number);
      } catch (error) {
        console.error("Failed to send email for room:", paymentDetail.room_number, error);
        emailSuccess = false; // Update success flag on failure
      }
    }

    return emailSuccess; // Return the overall success status
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

  const handleOpenUpdatePaymentDialog = () => {
    setOpenUpdatePaymentDialog(true);
  };

  const handleCloseUpdatePaymentDialog = () => {
    setOpenUpdatePaymentDialog(false);
  };
  const handleOpenGenerateDialog = () => {
    if (selectedRows.length === 0) {
      handleOpenSnackbar("Please select at least one room to proceed.", "error");
      return; // Exit the function early
    }
    setOpenGenerateDialog(true);
  };

  const handleAllUpdateGeneratedPaymentStatus = async (newStatus) => {
    // Filter selected rows and map to bill_id instead of room_id
    const billsToUpdate = selectedRows
      .filter((rowId) => {
        const paymentDetail = payments.find((payment) => payment.id === rowId);
        return paymentDetail && paymentDetail.id; // Ensure there's a bill_id
      })
      .map((rowId) => payments.find((payment) => payment.id === rowId).id);

    if (billsToUpdate.length > 0 && newStatus) {
      try {
        await axios.put("http://localhost:3000/updateallpaymentstatus", {
          billIds: billsToUpdate, // Send an array of billIds to update
          newStatus, // Send the new status selected from the dropdown
        });
        await fetchPaymentsdetails(); // Fetch updated payment details
        setSelectedRows([]); // Optionally clear selected rows after update
        return true;
      } catch (error) {
        console.error("Failed to update payment statuses for selected bills:", error);
        return false;
      }
    }
    return true; // Return true if there's nothing to update
  };

  // Event handler for when the 'Update' button is clicked
  const handleUpdateGeneratedPaymentStatus = () => {
    if (selectedPaymentStatus) {
      handleAllUpdateGeneratedPaymentStatus(selectedPaymentStatus);
      setOpenUpdatePaymentDialog(false);
    } else {
    }
  };

  const sortedRooms = selectedRooms
    .map((room) => room.trim())
    .sort((a, b) => a - b)
    .join(", ");

  const dateObject = new Date(selectedGenerationDate);
  const formattedDate = dateObject.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const paymentStatusOptions = [
    { label: "PAID", value: "PAID" },
    { label: "PARTIAL", value: "PARTIAL" },
    { label: "OVERDUE", value: "OVERDUE" },
    // { label: "Null", value: "Null" },
  ];
  const ITEM_HEIGHT = 48;

  // console.log("Payments", payments);
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
            {selectedTab === 0 && (
              <Button variant="contained" color="primary" onClick={handleOpenGenerateDialog} disabled={payments.filter((payment) => payment.payment_status === "Null").length === 0}>
                Generate Payments
              </Button>
            )}

            {selectedTab === 1 && (
              <>
                <Button variant="contained" color="primary" onClick={handleGenerateReciept} sx={{ marginRight: "10px" }} disabled={payments.filter((payment) => payment.payment_status === "PENDING").length === 0}>
                  Generate Payments
                </Button>
                <Button variant="contained" color="primary" onClick={handleOpenUpdatePaymentDialog} disabled={payments.filter((payment) => payment.payment_status === "PENDING").length === 0}>
                  Update Payments
                </Button>
              </>
            )}

            {selectedTab === 2 && (
              <Button variant="contained" color="primary" onClick={handleAllPaidPaymentInvoiceGenerate} disabled={payments.filter((payment) => payment.payment_status === "PAID").length === 0}>
                Print Payments
              </Button>
            )}

            {selectedTab === 3 && (
              <Button variant="contained" color="primary" onClick={handleOpenUpdatePaymentDialog} disabled={payments.filter((payment) => payment.payment_status !== "Null" && payment.payment_status !== "PENDING" && payment.payment_status !== "PAID").length === 0}>
                Update Payments
              </Button>
            )}
          </Box>

          <Box sx={{ width: "30%" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Generation Date</InputLabel>
              <Select
                value={selectedGenerationDate || ""}
                onChange={handleGenerationDateChange}
                label="Select Generation Date"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 2.5, // Set the max-height to show 3.5 items at a time
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>No Date</em>
                </MenuItem>
                {generationDates?.map((date, index) => (
                  <MenuItem key={index} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: "10px" }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="payment status tabs">
          <Tab label={`Generate Bill (${payments.filter((payment) => payment.payment_status === "Null").length})`} />
          <Tab label={`Pending (${payments.filter((payment) => payment.payment_status === "PENDING").length})`} />
          <Tab label={`Paid (${payments.filter((payment) => payment.payment_status === "PAID").length})`} />

          <Tab label={`Other (${payments.filter((payment) => payment.payment_status !== "Null" && payment.payment_status !== "PENDING" && payment.payment_status !== "PAID").length})`} />
        </Tabs>
      </Box>
      <Card sx={{ marginTop: "4px" }}>
        <DataGrid
          // rows={payments}
          rows={filteredPayments}
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

      {/* Generate Payment */}
      <Dialog
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        aria-labelledby="dialog-title"
        sx={{ "& .MuiDialog-paper": { minWidth: "45vw", maxWidth: "80vw" } }} // Adjust '300px' and '80vw' as needed
      >
        <DialogTitle
          id="dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="div">
            Generate Payment For Selected Rooms
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ textAlign: "right", opacity: "0.8", alignSelf: "flex-end" }}>
            {formattedDate}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <TextField
            sx={{ mt: "5px" }}
            fullWidth
            label="Room Details"
            multiline
            rows={4}
            value={sortedRooms}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAllPaymentGenerate} color="primary">
            Confirm
          </Button>
          <Button variant="outlined" onClick={() => setOpenGenerateDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdatePaymentDialog}
        onClose={handleCloseUpdatePaymentDialog}
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px", // Set the max width you want
            maxHeight: "80vh", // Set the max height you want
            width: "100%", // Use 100% width up to the maxWidth
          },
        }}
      >
        <DialogTitle>Change Payment Status</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Autocomplete
              fullWidth
              options={paymentStatusOptions}
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) => {
                // newValue will be the selected item from the options or null
                setSelectedPaymentStatus(newValue ? newValue.value : null);
              }}
              renderInput={(params) => <TextField {...params} label="Payment Status" variant="outlined" />}
            />
          </Box>

          <TextField
            sx={{ mt: "5px" }}
            fullWidth
            label="Room Details"
            multiline
            rows={4}
            value={sortedRooms}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdatePaymentDialog}>Cancel</Button>
          <Button onClick={handleUpdateGeneratedPaymentStatus}>Update</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity} // Use the dynamic severity
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
