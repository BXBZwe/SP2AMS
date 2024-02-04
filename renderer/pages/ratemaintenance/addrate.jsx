import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import { Card, CardContent, Typography, Button, Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert } from '@mui/material';
import axios from "axios";

// ... Rest of your code ...



export default function AddRate() {
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let tempErrors = {};
    tempErrors.item_name = isEditing.item_name ? "" : "Item Name is required.";
    tempErrors.item_price = isEditing.item_price ? "" : "Item Price is required.";
    tempErrors.item_description = isEditing.item_description ? "" : "Item Description is required.";

    setErrors(tempErrors);

    // Check if all errors are empty
    return !Object.values(tempErrors).some((x) => x !== "") &&
      // Check if all inputs are filled
      Object.values(isEditing).every((value) => value !== "");
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); // State for showing the Alert
  const router = useRouter();
  const [isEditing, setIsEditing]  = useState({
    rate_id: "",
    item_name: "",
    item_price: "",
    item_description: "",
    last_updated: "",
  });

  // Create separate handlers for each input
  const handleItemNameChange = (event) => {
    const { value } = event.target;
    setIsEditing({
      ...isEditing,
      item_name: value,
    });

    // Clear the error for this field when it's being edited
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

    // Clear the error for this field when it's being edited
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

    // Clear the error for this field when it's being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      item_description: "",
    }));
  };

  const handleAddClick = () => {
    // Check if all input fields are filled
    if (
      isEditing.item_name.trim() !== "" &&
      isEditing.item_price.trim() !== "" &&
      isEditing.item_description.trim() !== ""
    ) {
      // Open the confirmation dialog
      setOpenDialog(true);
    } else {
      // Show an error message and apply red outline to input fields
      setErrors((prevErrors) => ({
        ...prevErrors,
        item_name: isEditing.item_name.trim() === "" ? "Item Name is required." : "",
        item_price: isEditing.item_price.trim() === "" ? "Item Price is required." : "",
        item_description: isEditing.item_description.trim() === "" ? "Item Description is required." : "",
      }));
    }
  };

  const handleDialogClose = () => {
    // Close the confirmation dialog
    setOpenDialog(false);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    axios.post('http://localhost:3000/addrates', isEditing)
      .then(response => {
        console.log('Item saved successfully:', response.data);
        // Show the Alert when the item is added
        setAlertOpen(true);
      })
      .catch(error => {
        // Handle error
        console.error('Error saving item:', error);
      });
    // Optionally, you may want to reset the formData to its initial state after saving
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
    // Implement your cancel logic here
    // For example, you can navigate back using the router
    router.back();
  };

  const handleAlertClose = () => {
    // Close the Alert when the user closes it
    setAlertOpen(false);
  };

  return (
    <>
      <Card sx={{ width: '100%', display: 'flex' }}>
        <CardContent
          sx={{
            marginRight: 'auto',
            marginBottom: '10px',
          }}
        >
          <Typography variant="h4">Edit Added Items</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Change or Edit Items.
          </Typography>
        </CardContent>
        <CardContent>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                sx={{ width: '100px', marginTop: '15px', marginRight: '10px' }}
                onClick={handleAddClick}
              >
                Add
              </Button>
              <Button
                variant="contained"
                sx={{ width: '100px', marginTop: '15px' }}
                onClick={handleCancelClick}
              >
                Back
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{ width: '100px', marginTop: '15px' }}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </CardContent>
      </Card>
      <Card sx={{marginTop: '10px',  width: '100%', marginBottom: '10px', display: 'flex' }}>
        <CardContent sx={{ display: 'inline-block' }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Select Items
          </Typography>
          <TextField
            id="item_name"
            label="Item Name"
            variant="outlined"
            value={isEditing.item_name}
            sx={{
              width: '100%',
              marginBottom: 1.5,
              marginRight: 5,
              display: 'flex',
              border: errors.item_name ? '1px solid red' : 'none',
            }}
            onChange={handleItemNameChange}
            disabled={!isEditing}
          />
          <Typography color="error" variant="caption" >
            {errors.item_name}
          </Typography>
          <TextField
            id="item_price"
            label="Item Price"
            variant="outlined"
            type="number"
            value={isEditing.item_price}
            sx={{
              width: '100%',
              marginBottom: 1.5,
              marginRight: 5,
              display: 'flex',
              border: errors.item_price ? '1px solid red' : 'none',
            }}
            onChange={handleItemPriceChange}
            disabled={!isEditing}
          />
          <Typography color="error" variant="caption">
            {errors.item_price}
          </Typography>
          <TextField
            id="item_description"
            label="Item Description"
            variant="outlined"
            value={isEditing.item_description}
            sx={{
              width: '100%',
              marginBottom: 1,
              marginRight: 5,
              display: 'flex',
              border: errors.item_description ? '1px solid red' : 'none',
            }}
            onChange={handleItemDescriptionChange}
            disabled={!isEditing}
          />
          <Typography color="error" variant="caption" >
            {errors.item_description}
          </Typography>
        </CardContent>
        <CardContent sx={{ marginTop: 5.5 }}>
          <Typography sx={{ display: 'inline-block', marginLeft: 10 }}>
            <b>VAT</b>
            <Checkbox
              defaultChecked
              sx={{ marginLeft: 5 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Add VAT 7% to Price</span>
            <br></br>
            <b>Payment</b>
            <Checkbox
              defaultChecked
              sx={{ marginLeft: 0.7 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Billing After Usage</span>
            <br></br>
            <b>Meter</b>
            <Checkbox
              defaultChecked
              sx={{ marginLeft: 3.3 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Calculate from Meter</span>
            <br></br>
            <b>Bill</b>
            <Checkbox
              defaultChecked
              sx={{ marginLeft: 5.8 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Show Month on Bill</span>
            <br></br>
            <b>Usage</b>
            <Checkbox
              defaultChecked
              sx={{ marginLeft: 2.9 }}
              disabled={!isEditing}
            />
            <span style={{ opacity: '60%' }}>Not Use Item</span> <br></br>
          </Typography>
          <br></br>
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Add Rate Item</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to add the item?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveClick} color="primary">
                Confirm Save
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
              open={alertOpen}
              autoHideDuration={3000}
              onClose={handleAlertClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Alert onClose={handleAlertClose} severity="success">
                The item is added.
              </Alert>
            </Snackbar>
        </CardContent>
      </Card>
    </>
  );
}
