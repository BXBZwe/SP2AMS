import React, { useState, useMemo, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { Card, CardContent, Autocomplete, Typography, Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Snackbar, Alert, Box, Grid } from "@mui/material";
import axios from "axios";
import { useSnackbarContext } from "../../components/snackBar/SnackbarContent";
import MuiAlert from "@mui/material/Alert";
import { useAPI } from "../../components/ratemaintenance/apiContent";

export default function AddRate() {
  const { addRate } = useAPI();
  const [rates, setRates] = useState([]);
  const [errors, setErrors] = useState({});
  const { openSnackbar } = useSnackbarContext();
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [includeVAT, setIncludeVAT] = useState(false);
  const [VATPercentage, setVATPercentage] = useState(0);

  const itemOptions = useMemo(() => {
    const defaultOptions = ["Water", "Electricity", "Other"];
    const selectedItems = rates.map((rate) => rate.item_name);
    return defaultOptions.filter((option) => !selectedItems.includes(option));
  }, [rates]);
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getallrates");
        setRates(response.data.getRate);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    const fetchLatestVATPercentage = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getLatestVATPercentage");
        setVATPercentage(response.data.latestVATPercentage);
      } catch (error) {
        console.error("Error fetching latest VAT percentage:", error);
      }
    };

    fetchLatestVATPercentage();
    fetchRates();
  }, []);
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validateForm = () => {
    let tempErrors = {};

    if (isOtherSelected) {
      tempErrors.custom_item_name = isEditing.item_name.trim() ? "" : "Custom Item Name is required.";
    } else {
      tempErrors.item_name = isEditing.item_name.trim() ? "" : "Item Name is required.";
    }

    tempErrors.item_price = isEditing.item_price.trim() ? "" : "Item Price is required.";
    tempErrors.item_description = isEditing.item_description.trim() ? "" : "Item Description is required.";

    setErrors(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState({
    rate_id: "",
    item_name: "",
    item_price: "",
    item_description: "",
    last_updated: "",
  });

  const handleItemChange = (event, newValue) => {
    if (newValue === "Other") {
      setIsOtherSelected(true);
      setIsEditing({ ...isEditing, item_name: "" });
    } else {
      setIsOtherSelected(false);
      setIsEditing({ ...isEditing, item_name: newValue });
    }
  };

  const handleCustomItemChange = (event) => {
    const { value } = event.target;
    setIsEditing({ ...isEditing, item_name: value });
  };

  const handleItemNameChange = (event) => {
    const { value } = event.target;
    setIsEditing({
      ...isEditing,
      item_name: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      item_name: "",
    }));
  };

  const handleItemPriceChange = (event) => {
    const { value } = event.target;
    setIsEditing({
      ...isEditing,
      item_price: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      item_price: "",
    }));
  };

  const handleItemDescriptionChange = (event) => {
    const { value } = event.target;
    setIsEditing({
      ...isEditing,
      item_description: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      item_description: "",
    }));
  };

  const handleAddClick = () => {
    if (isEditing.item_name.trim() !== "" && isEditing.item_price.trim() !== "" && isEditing.item_description.trim() !== "") {
      setOpenDialog(true);
    } else {
      setSnackbarOpen(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        item_name: isEditing.item_name.trim() === "" ? "Item Name is required." : "",
        item_price: isEditing.item_price.trim() === "" ? "Item Price is required." : "",
        item_description: isEditing.item_description.trim() === "" ? "Item Description is required." : "",
      }));
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmAdd = () => {
    setIsEditing(false);
    const payload = {
      ...isEditing,
      VAT_Percentage: includeVAT ? VATPercentage : 0,
    };
    axios
      .post("http://localhost:3000/addrates", payload)

      .then((response) => {
        openSnackbar("Rate added successfully!", "success");
        setTimeout(() => {
          router.push("/rateMaintenance");
        }, 500);
        setOpenDialog(false);
      })
      .catch((error) => {
        // Handle error
        console.error("Error saving item:", error);
      });
    setIsEditing({
      rate_id: "",
      item_name: "",
      item_price: "",
      item_description: "",
      last_updated: "",
    });
    setOpenDialog(false);
    const isValid = validateForm();

    if (isValid) {
      setOpenDialog(true);
    }
  };

  const handleCancelClick = () => {
    router.back();
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // const saveVATPercentage = async (req, res) => {
  //   const { rate_id, VAT_Percentage } = req.body;

  //   try {
  //     const updatedRate = await prisma.rates.update({
  //       where: { rate_id },
  //       data: {
  //         VAT_Percentage,
  //         last_updated: new Date(), // Update the timestamp to now
  //       },
  //     });
  //     res.status(200).json({ message: "VAT percentage updated successfully", data: updatedRate });
  //   } catch (error) {
  //     res.status(500).send(error.message);
  //   }
  // };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex" }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Add new Rate/Item</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Add new rates and items
          </Typography>
        </CardContent>
        <CardContent>
          {isEditing ? (
            <>
              <Button variant="outlined" sx={{ width: "110px", marginTop: "15px", marginRight: "10px" }} onClick={handleCancelClick}>
                Back
              </Button>
              <Button variant="contained" sx={{ width: "110px", marginTop: "15px" }} onClick={handleAddClick}>
                Add
              </Button>
            </>
          ) : (
            <Button variant="contained" sx={{ width: "110px", marginTop: "15px" }} onClick={handleEditClick}>
              Edit
            </Button>
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
          {" "}
          <Box sx={{ width: "100%", marginBottom: 1.5 }}>
            <Autocomplete options={itemOptions} value={isOtherSelected ? "Other" : isEditing.item_name || ""} onChange={handleItemChange} renderInput={(params) => <TextField {...params} label="Item Name" error={!!errors.item_name} helperText={errors.item_name || ""} />} freeSolo />
            {isOtherSelected && <TextField sx={{ mt: 1.5 }} label="Custom Item Name" value={isEditing.item_name} onChange={handleCustomItemChange} fullWidth error={!!errors.item_name} helperText={errors.item_name || ""} />}
          </Box>
          <TextField
            id="item_price"
            label="Item Price"
            variant="outlined"
            type="number"
            value={isEditing.item_price}
            error={!!errors.item_price}
            helperText={errors.item_price || ""}
            sx={{
              width: "100%",
              marginBottom: 1.5,
              marginRight: 5,
              display: "flex",
            }}
            onChange={handleItemPriceChange}
            disabled={!isEditing}
          />
          <TextField
            id="item_description"
            label="Item Description"
            variant="outlined"
            value={isEditing.item_description}
            error={!!errors.item_description}
            helperText={errors.item_description || ""}
            sx={{
              width: "100%",
              marginBottom: 1,
              marginRight: 5,
              display: "flex",
            }}
            multiline
            rows={4}
            margin="dense"
            onChange={handleItemDescriptionChange}
            disabled={!isEditing}
          />
        </CardContent>
        <CardContent>
          <Grid container spacing={0.5}>
            <Grid item xs={12}>
              <Typography variant="h6">Options</Typography>
            </Grid>
            <Grid item xs={6}>
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
              {includeVAT && <TextField type="number" label="VAT Percentage" value={VATPercentage} onChange={(e) => setVATPercentage(e.target.value)} disabled={!isEditing} />}
            </Grid>
            <Grid item xs={6}>
              <Checkbox defaultChecked disabled={!isEditing} />
              <Typography variant="body2" component="span">
                Not Use Item
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Add Rate Item</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to add the item?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConfirmAdd} color="primary">
              Confirm Save
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Alert onClose={handleAlertClose} severity="success">
            The item is added.
          </Alert>
        </Snackbar>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          Please enter all fields!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
