import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Snackbar,
  Alert,
  Checkbox,
  CardActions,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import { useSnackbarContext } from "../../components/snackBar/SnackbarContent";
import MuiAlert from "@mui/material/Alert";

export default function EditRate() {
  const router = useRouter();
  const { rateId } = router.query;
  const [rateData, setRateData] = useState({
    item_name: "",
    item_price: "",
    item_description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { openSnackbar } = useSnackbarContext();
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [includeVAT, setIncludeVAT] = useState(false);
  const [disableRate, setDisableRate] = useState(false);
  const [VATPercentage, setVATPercentage] = useState(0);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/geteachrate/${rateId}`
        );
        setRateData(response.data.data);
        // console.log(response.data.data);
        setIncludeVAT(response.data.data.VAT_Percentage > 0);
        setVATPercentage(response.data.data.VAT_Percentage);
        setDisableRate(response.data.data.disable_rate);
      } catch (error) {
        console.error("Failed to fetch rate data", error);
        openSnackbar("Failed to fetch rate data", "error");
      }
    };

    if (rateId) fetchRate();
  }, [rateId, openSnackbar]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRateData((prev) => ({ ...prev, [name]: value }));
  };

  // console.log("rate data", rateData);

  const validateForm = () => {
    let tempErrors = {};
    if (!rateData.item_name) tempErrors.item_name = "Item name is required.";
    if (!rateData.item_price) tempErrors.item_price = "Item price is required.";
    if (!rateData.item_description)
      tempErrors.item_description = "Description is required.";
    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleBack = () => {
    router.back();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // const handleConfirmSave = async () => {
  //   // console.log(rateId)
  //   if (validateForm()) {
  //     try {
  //       await axios.put(
  //         `http://localhost:3000/updaterates/${rateId}`,
  //         rateData,
          
  //       );
  //       openSnackbar("Rate updated successfully", "success");
  //       setIsEditing(false);
  //       router.push("/rateMaintenance");
  //     } catch (error) {
  //       console.error("Failed to update rate", error);
  //       openSnackbar("Failed to update rate", "error");
  //     }
  //   }
  // };

  console.log("VAT",VATPercentage)
  const handleConfirmSave = async () => {
    if (validateForm()) {
      try {
        const dataToSend = {
          ...rateData,
          VAT_Percentage: includeVAT ? VATPercentage : 0,
          disable_rate: disableRate,
        };
        await axios.put(
          `http://localhost:3000/updaterates/${rateId}`,
          dataToSend
        );
        openSnackbar("Rate updated successfully", "success");
        setIsEditing(false);
        router.push("/rateMaintenance");
      } catch (error) {
        console.error("Failed to update rate", error);
        openSnackbar("Failed to update rate", "error");
      }
    }
  };
  

  const handleSave = () => {
    if (!validateForm()) {
      // Show the Snackbar if validation fails
      setSnackbarOpen(true);
      return;
    }
    setOpenDialog(true);
  };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: "10px" }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Edit Rates</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Edit rates and items
          </Typography>
        </CardContent>
        <CardContent>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                sx={{ width: "110px", marginTop: "15px", marginRight: "10px" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ width: "110px", marginTop: "15px" }}
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{ width: "110px", marginTop: "15px", marginRight: "10px" }}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{ width: "110px", marginTop: "15px" }}
                onClick={handleEdit}
              >
                Edit
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <Card
        sx={{
          marginTop: "10px",
          width: "100%",
          marginBottom: "10px",
          display: "flex",
        }}
      >
        <CardContent sx={{ display: "inline-block", width: "60vw" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "15px" }}>
        <Box sx={{ width: "45vw" }}>
        <TextField
            label="Item Name"
            name="item_name"
            value={rateData.item_name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            error={!!errors.item_name}
            helperText={errors.item_name}
            disabled={!isEditing}
          />

          <TextField
            label="Item Price"
            name="item_price"
            type="number"
            value={rateData.item_price}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            error={!!errors.item_price}
            helperText={errors.item_price}
            disabled={!isEditing}
          />
          <TextField
            label="Item Description"
            name="item_description"
            value={rateData.item_description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            margin="dense"
            error={!!errors.item_description}
            helperText={errors.item_description}
            disabled={!isEditing}
          />
          </Box>
          <Box>
            <Typography variant="h6">Options</Typography>
            <Box>
              <Checkbox
                checked={includeVAT}
                onChange={(e) => {
                  setIncludeVAT(e.target.checked);
                }}
                disabled={!isEditing}
              />
              <Typography variant="body2" component="span">
                VAT
              </Typography>
            </Box>
            <Box>
              {includeVAT && (
                <TextField
                  sx={{ width: "60%" }}
                  type="number"
                  label="VAT Percentage"
                  value={VATPercentage}
                  onChange={(e) => setVATPercentage(e.target.value)}
                  disabled={!isEditing}
                />
              )}
            </Box>
            <Checkbox
              checked={disableRate}
              disabled={!isEditing}
              onChange={(e) => {
                setDisableRate(e.target.checked);
              }}
            />
            <Typography variant="body2" component="span">
              Disable Item
            </Typography>
          </Box>
          </Box>


        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {/* <Typography variant="h5"> */}
          Update Item {rateData.item_name}
          {/* </Typography> */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmSave} autoFocus>
            Confirm Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Please enter all required fields.
        </MuiAlert>
      </Snackbar>
    </>
  );
}
