import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Dialog,
  TextField,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from "@mui/material";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

export default function ContractTable() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [contracts, setContracts] = useState([]);

  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedPeriodOfStay, setUpdatedPeriodOfStay] = useState("");
  const [loading, setLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);

  const columns = [
    { field: "room_number", headerName: "Room Number", flex:0.25 },
    { field: "tenant_name", headerName: "Tenant Name", flex:0.25 },
    {
      field: "contract_status",
      headerName: "Contract Status",
      flex:0.25,
      renderCell: (params) => {
        let color;
        switch (params.value.toLowerCase()) {
          case "ongoing":
            color = "primary"; // MUI blue color
            break;
          case "due":
            color = "warning"; // MUI orange color
            break;
          case "warning":
            color = "error";
            break;
          case "new":
            color = "default";
            break;
          default:
            color = "default";
        }

        const handleClick = () => {
          setSelectedTenantId(params.row.id);
          if (params.value.toLowerCase() === "new") {
            setOpenDialog(true);
          } else if (["ongoing", "due", "warning"].includes(params.value.toLowerCase())) {
            setOpenUpdateDialog(true);
          }
        };

        return (
          <Chip
          label={params.value}
          color={color}
          size="small"
          onClick={handleClick}
          variant="outlined"
          style={{
            width: "80%", // set the width to 100% to fill the cell
            justifyContent: "center", // center the text inside the chip
          }}
        />
          
          // <Button variant="outlined" color={color} onClick={handleClick}>
          //   {params.value}
          // </Button>
        );
      },
    },
    {
      field: "contract_days_left",
      headerName: "Contract Days Left",
      flex:0.25,
    },
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
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchContractData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filteredData = contracts.filter((contract) => contract.tenant_name.toLowerCase().includes(searchText.toLowerCase()) && (statusFilter ? contract.contract_status.toLowerCase() === statusFilter.toLowerCase() : true));
      setFilteredContracts(filteredData);
    };

    applyFilters();
  }, [searchText, statusFilter, contracts]);

  const handleGenerateDocument = async (language) => {
    setOpenDialog(false);
    setOpenUpdateDialog(false);
    setDocumentLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/createfilledcontract/${selectedTenantId}/${language}`, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error generating document:", error);
    } finally {
      setDocumentLoading(false); // Stop loading
    }
  };

  const fetchContractData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/getcontractdetails");
      const data = response.data.map((contract) => ({
        id: contract.tenants.tenant_id,
        room_number: contract.RoomBaseDetails.room_number,
        tenant_name: `${contract.tenants.first_name} ${contract.tenants.last_name}`,
        contract_status: contract.tenants.contract_status,
        contract_days_left: contract.contract_days_left !== null ? contract.contract_days_left : "-",
      }));
      setContracts(data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  const handleUpdatePeriodOfStay = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/updatePeriodOfStay/${selectedTenantId}`, {
        newPeriod: updatedPeriodOfStay,
      });
      await fetchContractData();
      setOpenUpdateDialog(false);
      // console.log('Update Clicked',contracts)
    } catch (error) {
      console.error("Error updating period of stay:", error);
    } finally {
      setLoading(false);
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
      <Card sx={{ width: "100%", overflow: "hidden", marginTop: "10px" }}>
        <CardContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <TextField id="search-bar" label="Search Tenant" variant="outlined" fullWidth sx={{ marginRight: "10px", width: "80%" }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel id="status-filter-label">Contract Status</InputLabel>
              <Select labelId="status-filter-label" id="status-filter" value={statusFilter} label="Contract Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="due">Due</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="checkout">Checkout</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </div>
          <DataGrid
            rows={filteredContracts}
            getRowId={(row) => row.room_number}
            columns={columns}
            pageSize={5}
            pageSizeOptions={[5, 10]}
            sx={{
              "& .MuiDataGrid-main": { maxHeight: "70vh" }, // Adjust based on your layout
            }}
            autoHeight
            density="compact"
            rowHeight={80}
          />
        </CardContent>
      </Card>
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle>Contract Options</DialogTitle>
          <IconButton sx={{ paddingRight: "10px" }} onClick={() => setOpenUpdateDialog(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <DialogContentText>Please update the period of stay (if necessary) before generating the contract document.</DialogContentText>
          <TextField autoFocus margin="dense" id="periodOfStay" label="Period of Stay (months)" type="number" fullWidth variant="standard" value={updatedPeriodOfStay} onChange={(e) => setUpdatedPeriodOfStay(e.target.value)} disabled={loading} />
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Button onClick={() => handleGenerateDocument("english")}>English Contract</Button>
                  <Button onClick={() => handleGenerateDocument("thai")}>Thai Contract</Button>
                </>
              )}
            </Box>

            <Box>
              <Button variant="outlined" onClick={handleUpdatePeriodOfStay} disabled={loading}>
                Update
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog open={documentLoading} aria-labelledby="loading-dialog-title">
        <DialogTitle id="loading-dialog-title">Generating Contract</DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please wait...
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}
