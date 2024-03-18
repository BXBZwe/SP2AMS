import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { Card, CardContent, Typography, Box, Button, Select, MenuItem, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useSnackbarContext } from "../../components/snackBar/SnackbarContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PhotoCamera } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function addtenant() {
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");
  const theme = useTheme();
  const { openSnackbar } = useSnackbarContext();
  const paymentOptions = ["EMAIL", "PAPER", "BOTH"];
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const type = [{ label: "+93" }, { label: "+66" }, { label: "+10" }];
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(5, "year"));

  const [tenantData, setTenantData] = useState({
    first_name: "",
    last_name: "",
    personal_id: "",
    gender: "",
    // issue_date: dayjs(),
    // expiration_date: dayjs().add(5, "year"),
    invoice_option: "",
    addresses: {
      addressnumber: "",
      street: "",
      sub_district: "",
      district: "",
      province: "",
      postal_code: "",
    },
    contacts: {
      phone_number: "",
      email: "",
      line_id: "",
      eme_name: "",
      eme_phone: "",
      eme_line_id: "",
      eme_relation: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [tenantImage, settenantImage] = useState(null);
  const [nationalCardImage, setNationalCardImage] = useState(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.first_name = tenantData.first_name ? "" : "First name is required.";
    tempErrors.last_name = tenantData.last_name ? "" : "Last name is required.";
    tempErrors.personal_id = tenantData.personal_id ? "" : "Personal ID is required.";
    tempErrors.invoice_option = tenantData.invoice_option ? "" : "Invoice option is required.";
    const emailRegex = /\S+@\S+\.\S+/;
    tempErrors.email = emailRegex.test(tenantData.contacts.email) ? "" : "Invalid email format.";
    const phoneRegex = /^[0-9]{10,12}$/;
    tempErrors.phone_number = phoneRegex.test(tenantData.contacts.phone_number) ? "" : "Invalid phone number format.";
    tempErrors.eme_name = tenantData.contacts.eme_name ? "" : "Emergency contact name is required.";
    tempErrors.eme_phone = phoneRegex.test(tenantData.contacts.eme_phone) ? "" : "Invalid emergency contact phone number format.";
    tempErrors.eme_line_id = tenantData.contacts.eme_line_id ? "" : "Emergency contact Line ID is required.";
    tempErrors.eme_relation = tenantData.contacts.eme_relation ? "" : "Emergency contact relationship is required.";
    tempErrors.addressnumber = tenantData.addresses.addressnumber ? "" : "Address number is required.";
    tempErrors.street = tenantData.addresses.street ? "" : "Street is required.";
    tempErrors.district = tenantData.addresses.district ? "" : "District is required.";
    tempErrors.province = tenantData.addresses.province ? "" : "Province is required.";
    tempErrors.postal_code = tenantData.addresses.postal_code ? "" : "Postal code is required.";
    tempErrors.sub_district = tenantData.addresses.sub_district ? "" : "Sub district is required.";
    tempErrors.tenantImage = tenantImage ? "" : "Tenant image is required.";
    tempErrors.nationalCardImage = nationalCardImage ? "" : "National ID image is required.";
    // Add validation for start date
    if (!startDate || startDate.toString().trim() === "") {
      tempErrors.startDate = "Start date is required";
    }

    // Add validation for end date
    if (!endDate || endDate.toString().trim() === "") {
      tempErrors.endDate = "End date is required";
    }
    let isFormValid = Object.values(tempErrors).every((x) => x === "");

    if (!isFormValid) {
      setErrorSnackbarMessage("Please correct the errors before submitting.");
      setErrorSnackbarOpen(true);
    }

    setErrors(tempErrors);
    return isFormValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setTenantData({ ...tenantData, [name]: value });
    } else if (keys.length === 2 && (keys[0] === "addresses" || keys[0] === "contacts")) {
      setTenantData({
        ...tenantData,
        [keys[0]]: {
          ...tenantData[keys[0]],
          [keys[1]]: value,
        },
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmAdd = async (e) => {
    e.preventDefault();

    // setLoading(true);

    console.log(tenantData);
    setMessage("");
    const formdata = new FormData();

    Object.entries(tenantData).forEach(([key, value]) => {
      if (typeof value === "object") {
        formdata.append(key, JSON.stringify(value));
      } else {
        formdata.append(key, value);
      }
    });

    formdata.append("issue_date", startDate.toDate());
    formdata.append("expiration_date", endDate.toDate());

    if (tenantImage) formdata.append("tenant_image", tenantImage);
    if (nationalCardImage) formdata.append("nationalcard_image", nationalCardImage);

    try {
      const response = await axios.post("http://localhost:3000/addtenants", formdata, {
        headers: {
          "Content-Type": "multipart/form-data", // This header tells the server to expect multipart form data
        },
      });

      if (response.status === 200 || response.status === 201) {
        openSnackbar("Tenant Added successfully!", "success");
        setTimeout(() => {
          router.push("/tenantMaintenance");
        }, 500);
        // setOpenDialog(false);
        setOpenDialog(false);
      } else {
        throw new Error("An error occurred while adding the tenant");
      }
    } catch (error) {
      console.error("Error adding tenant:", error);
      setMessage(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTenantImageChange = (e) => {
    settenantImage(e.target.files[0]);
  };

  const handleNationalCardImagechange = (e) => {
    setNationalCardImage(e.target.files[0]);
  };

  return (
    <>
      <Card sx={{ width: "100%", display: "flex", marginBottom: 1 }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Tenant Maintenance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Remove or Add Tenant
          </Typography>
        </CardContent>
        <CardContent>
          <Button type="submit" variant="contained" sx={{ width: "110px", marginTop: "15px" }} component="a" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", height: "90%" }}>
        <Card sx={{ width: "100%", marginBottom: "10px" }}>
          <CardContent>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Tenant Details
            </Typography>

            <TextField id="first_name" name="first_name" label="First Name" value={tenantData.first_name} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} error={!!errors.first_name} helperText={errors.first_name} />
            <TextField id="last_name" name="last_name" label="Last Name" value={tenantData.last_name} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} error={!!errors.last_name} helperText={errors.last_name} />

            <RadioGroup row aria-label="gender" name="gender" value={tenantData.gender} onChange={(event) => setTenantData({ ...tenantData, gender: event.target.value })}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>

            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <TextField id="personal_id" name="personal_id" label="Personal ID" value={tenantData.personal_id} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} error={!!errors.personal_id} helperText={errors.personal_id} />

              <TextField id="phone_number" name="contacts.phone_number" label="Phone Number" value={tenantData.phone_number} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} error={!!errors.phone_number} helperText={errors.phone_number} />
            </Box>

            <TextField id="email" name="contacts.email" label="Email" variant="outlined" value={tenantData.email} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} error={!!errors.email} helperText={errors.email} />
            <TextField id="line_id" name="contacts.line_id" label="Line ID" variant="outlined" value={tenantData.line_id} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} error={!!errors.line_id} helperText={errors.line_id} />

            <Autocomplete
              id="invoice_option"
              options={paymentOptions}
              value={tenantData.invoice_option}
              onChange={(event, newValue) => {
                setTenantData({ ...tenantData, invoice_option: newValue });
              }}
              sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }}
              renderInput={(params) => <TextField {...params} error={!!errors.invoice_option} helperText={errors.invoice_option} label="Invoice Option" />}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Issue Date" value={startDate} onChange={(newValue) => setStartDate(newValue)} renderInput={(params) => <TextField {...params} error={!!errors.startDate} helperText={errors.startDate} />} />

              <DatePicker label="Expiration Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} renderInput={(params) => <TextField {...params} error={!!errors.endDate} helperText={errors.endDate} />} />
            </LocalizationProvider>
            <Typography sx={{ marginBottom: 1, marginTop: "10px" }}>Address</Typography>
            <div style={{ marginBottom: "1.5rem" }}>
              <TextField id="addressnumber" name="addresses.addressnumber" label="No." variant="outlined" value={tenantData.addressnumber} onChange={handleChange} sx={{ width: 270, marginRight: 0.5 }} error={!!errors.addressnumber} helperText={errors.addressnumber} />

              <TextField id="street" name="addresses.street" label="Street" variant="outlined" value={tenantData.street} onChange={handleChange} sx={{ width: 270 }} error={!!errors.street} helperText={errors.street} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <TextField id="district" name="addresses.district" label="District" variant="outlined" value={tenantData.district} onChange={handleChange} sx={{ width: 270, marginRight: 0.5 }} error={!!errors.district} helperText={errors.district} />

              <TextField id="sub_district" name="addresses.sub_district" label="Sub District" variant="outlined" value={tenantData.sub_district} onChange={handleChange} sx={{ width: 270 }} error={!!errors.sub_district} helperText={errors.sub_district} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <TextField id="province" name="addresses.province" label="Province" variant="outlined" value={tenantData.province} onChange={handleChange} sx={{ width: 270, marginRight: 0.5 }} error={!!errors.province} helperText={errors.province} />

              <TextField id="postal_code" name="addresses.postal_code" label="Postal Code" variant="outlined" value={tenantData.postal_code} onChange={handleChange} sx={{ width: 270 }} error={!!errors.postal_code} helperText={errors.postal_code} />
            </div>
          </CardContent>
          <Box sx={{ marginBottom: 2, marginLeft: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Emergency Contact
            </Typography>
            <TextField id="eme_name" name="contacts.eme_name" label="Full Name" variant="outlined" value={tenantData.eme_name} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} error={!!errors.eme_name} helperText={errors.eme_name} />
            <TextField id="eme_phone" name="contacts.eme_phone" label="Phone Number" variant="outlined" value={tenantData.eme_phone} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} error={!!errors.eme_phone} helperText={errors.eme_phone} />
            <TextField id="eme_line_id" name="contacts.eme_line_id" label="Line ID" variant="outlined" value={tenantData.eme_line_id} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} error={!!errors.eme_line_id} helperText={errors.eme_line_id} />
            <TextField id="eme_relation" name="contacts.eme_relation" label="Relationship" variant="outlined" value={tenantData.eme_relation} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} error={!!errors.eme_relation} helperText={errors.eme_relation} />
          </Box>
        </Card>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
          <Card
            sx={{
              display: "inline-block",
              width: "28vw",
              marginLeft: 2,
              marginBottom: "10px",
              height: "auto",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography sx={{ textAlign: "center", marginBottom: 0.3, fontWeight: "bold", fontSize: "19px" }}>Tenant Image</Typography>
              <Typography sx={{ textAlign: "center", margin: 0, opacity: "50%" }}>Attach a picture of tenant</Typography>
              {/* Display uploaded tenant image with fixed size */}
              {tenantImage && (
                <img
                  src={URL.createObjectURL(tenantImage)}
                  alt="Tenant"
                  style={{
                    width: "200px", // Fixed width
                    height: "200px", // Fixed height
                    objectFit: "contain", // Keep aspect ratio
                    marginTop: "10px",
                  }}
                />
              )}
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 5 }}>
                {/* Hidden input for tenant image */}
                <input accept="image/*" style={{ display: "none" }} id="tenant-image-upload" type="file" onChange={handleTenantImageChange} />
                {/* Label that acts as a button */}
                <label htmlFor="tenant-image-upload">
                  <Fab color="secondary" component="span" aria-label="add">
                    <PhotoCamera />
                  </Fab>
                </label>
              </Box>
            </CardContent>
          </Card>

          {/* National ID Image Upload */}
          <Card
            sx={{
              display: "inline-block",
              width: "28vw",
              marginLeft: 2,
              marginBottom: "10px",
              height: "auto",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography sx={{ textAlign: "center", marginBottom: 0.3, fontWeight: "bold", fontSize: "19px" }}>National Thai Citizen ID or Passport</Typography>
              <Typography sx={{ textAlign: "center", margin: 0, opacity: "50%" }}>Attach a copy of the tenant Identification</Typography>
              {/* Display uploaded national ID image with fixed size */}
              {nationalCardImage && (
                <img
                  src={URL.createObjectURL(nationalCardImage)}
                  alt="National ID"
                  style={{
                    width: "200px", // Fixed width
                    height: "200px", // Fixed height
                    objectFit: "contain", // Keep aspect ratio
                    marginTop: "10px",
                  }}
                />
              )}
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 5 }}>
                {/* Hidden input for national ID image */}
                <input accept="image/*" style={{ display: "none" }} id="national-id-image-upload" type="file" onChange={handleNationalCardImagechange} />
                {/* Label that acts as a button */}
                <label htmlFor="national-id-image-upload">
                  <Fab color="secondary" component="span" aria-label="add">
                    <PhotoCamera />
                  </Fab>
                </label>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Dialog fullScreen={fullScreen} open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{`Add Tenant ${tenantData.first_name} - ${tenantData.last_name}`}</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to add this tenant?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" autoFocus onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              // color="success"
              onClick={handleConfirmAdd}
              autoFocus
            >
              Confirm Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={() => setErrorSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setErrorSnackbarOpen(false)} severity="error" sx={{ width: "100%" }}>
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
