import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Card, CardContent, IconButton, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Typography } from "@mui/material";
import Link from "next/link";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

export default function ContractTable() {
  const theme = useTheme();
  const [contracts, setContracts] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(null);

  const columns = [
    { field: "room_number", headerName: "Room Number", width: 200 },
    { field: "tenant_name", headerName: "Tenant Name", width: 200 },
    {
      field: "contract_status",
      headerName: "Contract Status",
      width: 200,
      renderCell: (params) => (
        <Button variant="outlined" color="primary" onClick={() => handleClickOpen(params.row.id)} disabled={params.value.toLowerCase() !== "new"}>
          {params.value}
        </Button>
      ),
    },
    { field: "contract_days_left", headerName: "Contract Days Left", width: 200 },
  ];

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getcontractdetails");
        console.log("contract data: ", response.data);
        const data = response.data.map((contract) => {
          return {
            id: contract.tenants.tenant_id,
            room_number: contract.RoomBaseDetails.room_number,
            tenant_name: `${contract.tenants.first_name} ${contract.tenants.last_name}`,
            contract_status: contract.tenants.contract_status,
            contract_days_left: contract.contract_days_left !== null ? contract.contract_days_left : "-",
          };
        });
        setContracts(data);
        console.log("Tenants data:", data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchContractData();
  }, []);

  const handleClickOpen = (tenantId) => {
    setSelectedTenantId(tenantId);
    setOpenDialog(true);
  };

  const handleGenerateDocument = async (language) => {
    setOpenDialog(false);

    try {
      // Make a request to the backend to generate the PDF
      const response = await axios.get(`http://localhost:3000/createfilledcontract/${selectedTenantId}/${language}`, {
        responseType: "blob", // This ensures you get the PDF data as a blob
      });

      // Create a URL for the blob and open it in a new window for the preview
      const pdfUrl = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error generating document:", error);
      // You might want to show an error message to the user
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
          <Typography variant="h4">Contract Generation</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Generate or Re-new Contracts
          </Typography>
          <Typography variant="body2" sx={{ opacity: 1 }}>
            Tenant List
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ marginTop: "10px" }}>
        <DataGrid rows={contracts} getRowId={(row) => row.room_number} columns={columns} pageSize={5} pageSizeOptions={[5, 10]} />
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select Language</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select the language for the contract document.</DialogContentText>
          <Button onClick={() => handleGenerateDocument("english")}>English</Button>
          <Button onClick={() => handleGenerateDocument("thai")}>Thai</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
