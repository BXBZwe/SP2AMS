import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Typography, Box, Button, Select, MenuItem, IconButton } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useRouter } from "next/router";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Snackbar, Alert } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // Import dayjs
export default function updatetenant() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const { tenant_id } = router.query;
  const paymentOptions = ["Select", "EMAIL", "PAPER", "BOTH"];
  const [accountStatus, setAccountStatus] = useState("ACTIVE");
  // const [tenantImagePreview, setTenantImagePreview] = useState(null);
  // const [nationalIDImagePreview, setNationalIDImagePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // can be 'error', 'warning', 'info', 'success'
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  const [tenantImage, settenantImage] = useState(null);
  const [NationalCardImage, setNationalCardImage] = useState(null);
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    personal_id: false,
    invoice_option: false,
    addresses: false,
    contacts: false,
    addressnumber: "", // New
    startDate: "", // New
    endDate: "", // New
    // Add other fields as necessary
  });
  const type = [{ label: "+93" }, { label: "+66" }, { label: "+10" }];
  const [tenantData, setTenantData] = useState({
    first_name: "",
    last_name: "",
    personal_id: "",
    gender: "",
    issue_date: dayjs(),
    expiration_date: dayjs().add(5, "year"),
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
  //const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleSaveClick = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // If form is valid, open the confirmation dialog
      setConfirmDialogOpen(true);
    } else {
      // If form is not valid, show an error message or perform other actions as needed
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill out all required fields.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        console.log("Tenant ID:", tenant_id);
        const response = await axios.get(`http://localhost:3000/getatenant/${tenant_id}`);
        console.log("Received tenant data:", response.data);

        const tenant = response.data.getaTenant;
        const tenantImageUrl = tenant.tenant_image ? tenant.tenant_image : null;
        const nationalCardImageUrl = tenant.nationalcard_image ? tenant.nationalcard_image : null;

        setTenantData({
          first_name: tenant.first_name,
          last_name: tenant.last_name,
          personal_id: tenant.personal_id,
          gender: tenant.gender,
          tenant_image: tenantImageUrl,
          nationalcard_image: nationalCardImageUrl,
          invoice_option: tenant.invoice_option,
          addresses: tenant.addresses || { addressnumber: "", street: "", sub_district: "", district: "", province: "", postal_code: "" },
          contacts: tenant.contacts || { phone_number: "", email: "", line_id: "", eme_name: "", eme_phone: "", eme_line_id: "", eme_relation: "" },
        });
        setSelectedDate(dayjs(tenant.issue_date));
        setSelectedEndDate(dayjs(tenant.expiration_date));
        setAccountStatus(tenant.account_status);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      }
    };
    fetchTenantData();
  }, [tenant_id]);

  const handleChange = (e) => {
    // Clear error on change

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
    setErrors({ ...errors, [name]: false });
  };
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate first_name
    if (!tenantData.first_name.trim()) {
      newErrors.first_name = "First name is required";
      isValid = false;
    }

    // Validate last_name
    if (!tenantData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
      isValid = false;
    }

    // Validate personal_id
    if (!tenantData.personal_id.trim()) {
      newErrors.personal_id = "Personal ID is required";
      isValid = false;
    }

    // Validate invoice_option
    if (!tenantData.invoice_option || tenantData.invoice_option === "Select") {
      newErrors.invoice_option = "Invoice option is required";
      isValid = false;
    }

    // Validate contacts.phone_number
    if (!tenantData.contacts.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
      isValid = false;
    }

    // Validate contacts.email
    if (!tenantData.contacts.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    // Validate contacts.line_id
    if (!tenantData.contacts.line_id.trim()) {
      newErrors.line_id = "Line ID is required";
      isValid = false;
    }

    // Validate addresses.street
    if (!tenantData.addresses.street.trim()) {
      newErrors.street = "Street is required";
      isValid = false;
    }

    // Validate addresses.district
    if (!tenantData.addresses.district.trim()) {
      newErrors.district = "District is required";
      isValid = false;
    }

    // Validate addresses.province
    if (!tenantData.addresses.province.trim()) {
      newErrors.province = "Province is required";
      isValid = false;
    }

    // Validate addresses.postal_code
    if (!tenantData.addresses.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required";
      isValid = false;
    }

    // Validate addresses.sub_district
    if (!tenantData.addresses.sub_district.trim()) {
      newErrors.sub_district = "Sub district is required";
      isValid = false;
    }

    // Validate emergency contact fields if necessary
    // For example, validate eme_name
    if (!tenantData.contacts.eme_name.trim()) {
      newErrors.eme_name = "Emergency contact name is required";
      isValid = false;
    }

    // Validate emergency contact phone number
    if (!tenantData.contacts.eme_phone.trim()) {
      newErrors.eme_phone = "Emergency contact phone number is required";
      isValid = false;
    }

    // Validate emergency contact Line ID
    if (!tenantData.contacts.eme_line_id.trim()) {
      newErrors.eme_line_id = "Emergency contact Line ID is required";
      isValid = false;
    }

    // Validate emergency contact relationship
    if (!tenantData.contacts.eme_relation.trim()) {
      newErrors.eme_relation = "Emergency contact relationship is required";
      isValid = false;
    }
    if (!tenantData.addresses.addressnumber.trim()) {
      newErrors.addressnumber = "No. is required";
      isValid = false;
    }

    if (!selectedDate || selectedDate.toString().trim() === "") {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!selectedEndDate || selectedEndDate.toString().trim() === "") {
      newErrors.endDate = "End date is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setSnackbarMessage("Please fill out all required fields.");
      setSnackbarOpen(true);
    }

    return isValid;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill out all required fields.");
      setSnackbarOpen(true);
      return; // Prevent form submission if validation fails
    }

    setLoading(true);
    setMessage("");
    setConfirmDialogOpen(false); // Close the confirmation dialog
    
    const updatedTenantData = { ...tenantData, account_status: accountStatus };

    const formdata = new FormData();
    
    Object.keys(updatedTenantData).forEach((key) => {
      if (key === "addresses" || key === "contacts") {
        Object.keys(updatedTenantData[key]).forEach((subKey) => {
          formdata.append(`${key}[${subKey}]`, updatedTenantData[key][subKey]);
        });
      } else if (typeof updatedTenantData[key] === "object") {
        formdata.append(key, JSON.stringify(updatedTenantData[key]));
      } else {
        formdata.append(key, updatedTenantData[key]);
      }
    });

    if (tenantImage) formdata.append("tenant_image", tenantImage);
    if (NationalCardImage) formdata.append("nationalcard_image", NationalCardImage);
    formdata.append("issue_date", selectedDate.toISOString());
    formdata.append("expiration_date", selectedEndDate.toISOString());

    try {
      const response = await axios.put(`http://localhost:3000/updatetenants/${tenant_id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Show a success message using Snackbar
        setSnackbarSeverity("success");
        setSnackbarMessage("Tenant updated successfully.");
        setSnackbarOpen(true);
        // Use setTimeout to delay navigation, allowing the user to read the message
        setTimeout(() => {
          router.back(); // Navigate back to the previous page
        }, 2000); // Delay of 2000 milliseconds (2 seconds)
      } else {
        // If the response is not successful, show an error message
        setSnackbarSeverity("error");
        setSnackbarMessage("An error occurred while updating the tenant.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      // On catch, log the error and show an error message
      console.error("Error updating tenant:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.response?.data?.message || error.message || "An error occurred");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
};


  const handleTenantImageChange = (e) => {
    settenantImage(e.target.files[0]);
  };

  const handleNationalIDImageChange = (e) => {
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
            Remove or Add Tenant{" "}
          </Typography>
        </CardContent>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "110px", marginTop: "15px" }}
              component="a"
              onClick={handleSaveClick} // Updated to use handleSaveClick
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>

            <Button variant="contained" color={accountStatus === "ACTIVE" ? "success" : "secondary"} onClick={() => setAccountStatus((prevStatus) => (prevStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"))} sx={{ marginTop: "15px" }}>
              {accountStatus}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", height: "90%" }}>
        <Card sx={{ width: "100%", marginBottom: "10px" }}>
          <CardContent>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Tenant Details
            </Typography>

            <TextField id="first_name" name="first_name" label="First Name" value={tenantData.first_name} onChange={handleChange} error={!!errors.first_name} helperText={errors.first_name || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            <TextField id="last_name" name="last_name" label="Last Name" value={tenantData.last_name} onChange={handleChange} error={!!errors.last_name} helperText={errors.last_name || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />

            <RadioGroup aria-label="gender" name="gender" value={tenantData.gender} onChange={(event) => setTenantData({ ...tenantData, gender: event.target.value })} >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>

            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <TextField id="personal_id" name="personal_id" label="Personal ID" value={tenantData.personal_id} onChange={handleChange} error={!!errors.personal_id} helperText={errors.personal_id || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />

              <TextField id="phone_number" name="contacts.phone_number" label="Phone Number" value={tenantData.contacts.phone_number} onChange={handleChange} error={!!errors.phone_number} helperText={errors.phone_number || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            </Box>

            <Select label="Invoice Option" id="invoice_option" value={tenantData.invoice_option} onChange={(e) => setTenantData({ ...tenantData, invoice_option: e.target.value })} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }}>
              {paymentOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <TextField id="email" name="contacts.email" label="Email" value={tenantData.contacts.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6, marginLeft: -1.7 }} />
            <TextField id="line_id" name="contacts.line_id" label="Line ID" value={tenantData.contacts.line_id} onChange={handleChange} error={!!errors.line_id} helperText={errors.line_id || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Issue Date" value={selectedDate} onChange={(newValue) => setSelectedDate(newValue)} renderInput={(params) => <TextField {...params} error={!!errors.issue_date} helperText={errors.issue_date || ""} />} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
              <DatePicker label="Expiration Date" value={selectedEndDate} onChange={(newValue) => setSelectedEndDate(newValue)} renderInput={(params) => <TextField {...params} error={!!errors.expiration_date} helperText={errors.expiration_date || ""} />} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            </LocalizationProvider>
            <Typography sx={{ marginBottom: 1, marginTop: "10px" }}>Address</Typography>
            <div>
              <div style={{ marginBottom: "0.7rem" }}>
                <TextField id="addressnumber" name="addresses.addressnumber" label="No." value={tenantData.addresses.addressnumber} onChange={handleChange} error={!!errors.addressnumber} helperText={errors.addressnumber} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
                <TextField
                  id="street"
                  name="addresses.street"
                  label="Street"
                  value={tenantData.addresses.street}
                  onChange={handleChange}
                  error={!!errors.street}
                  helperText={errors.street || ""}
                  variant="outlined"
                  sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} // Adjusting width to fit in half
                />
              </div>

              <div style={{ marginBottom: "0.7rem" }}>
                <TextField
                  id="district"
                  name="addresses.district"
                  label="District"
                  value={tenantData.addresses.district}
                  onChange={handleChange}
                  error={!!errors.district}
                  helperText={errors.district || ""}
                  variant="outlined"
                  sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} // Adjusting width to fit in half minus margin
                />
                <TextField
                  id="province"
                  name="addresses.province"
                  label="Province"
                  value={tenantData.addresses.province}
                  onChange={handleChange}
                  error={!!errors.province}
                  helperText={errors.province || ""}
                  variant="outlined"
                  sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} // Adjusting width to fit in half
                />
              </div>

              <div style={{ marginBottom: "0.7rem" }}>
                <TextField
                  id="postal_code"
                  name="addresses.postal_code"
                  label="Postal Code"
                  value={tenantData.addresses.postal_code}
                  onChange={handleChange}
                  error={!!errors.postal_code}
                  helperText={errors.postal_code || ""}
                  variant="outlined"
                  sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} // Adjusting width to fit in half minus margin
                />
                <TextField
                  id="sub_district"
                  name="addresses.sub_district"
                  label="Sub District"
                  value={tenantData.addresses.sub_district}
                  onChange={handleChange}
                  error={!!errors.sub_district}
                  helperText={errors.sub_district || ""}
                  variant="outlined"
                  sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} // Adjusting width to fit in half
                />
              </div>
            </div>
          </CardContent>
          <Box sx={{ marginBottom: 2, marginLeft: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Emergency Contact
            </Typography>
            <TextField id="eme_name" name="contacts.eme_name" label="Emergency Contact Name" value={tenantData.contacts.eme_name} onChange={handleChange} error={!!errors.eme_name} helperText={errors.eme_name || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />

            <TextField id="eme_phone" name="contacts.eme_phone" label="Emergency Phone" value={tenantData.contacts.eme_phone} onChange={handleChange} error={!!errors.eme_phone} helperText={errors.eme_phone || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            <TextField id="eme_line_id" name="contacts.eme_line_id" label="Emergency Line ID" value={tenantData.contacts.eme_line_id} onChange={handleChange} error={!!errors.eme_line_id} helperText={errors.eme_line_id || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />

            <TextField id="eme_relation" name="contacts.eme_relation" label="Emergency Relationship" value={tenantData.contacts.eme_relation} onChange={handleChange} error={!!errors.eme_relation} helperText={errors.eme_relation || ""} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
          </Box>
        </Card>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
          <Card sx={{ display: "inline-block", width: "28vw", marginLeft: 2, marginBottom: "10px", height: "auto" }}>
            <CardContent sx={{ textAlign: "center", marginBottom: 2 }}>
              <Typography sx={{ textAlign: "center", marginBottom: 0.3, fontWeight: "bold", fontSize: "19px" }}>Tenant Image</Typography>
              <Typography sx={{ textAlign: "center", margin: 0, opacity: "50%" }}>Attach a picture of tenant</Typography>
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 5 }}>
                <img
                  src={tenantData.tenant_image}
                  alt="Tenant"
                  style={{
                    width: "200px", // Fixed width
                    height: "200px", // Fixed height
                    objectFit: "contain", // Keep aspect ratio
                    marginTop: "10px",
                  }}
                />
                <Box>
                  <input accept="image/*" type="file" id="tenant-image" style={{ display: "none" }} onChange={handleTenantImageChange} />
                  <label htmlFor="tenant-image">
                    <Fab color="secondary" component="span" aria-label="upload picture" marginBottom="10px">
                      <PhotoCamera />
                    </Fab>
                  </label>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ display: "inline-block", width: "28vw", marginLeft: 2, marginBottom: "10px", height: "auto" }}>
            <CardContent sx={{ textAlign: "center", marginBottom: 2 }}>
              <Typography sx={{ textAlign: "center", marginBottom: 0.3, fontWeight: "bold", fontSize: "19px" }}>National Thai Citizen ID or Passport</Typography>
              <Typography sx={{ textAlign: "center", margin: 0, opacity: "50%" }}>Attach a copy of the tenant Identification</Typography>
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 5 }}>
                <img
                  src={tenantData.nationalcard_image}
                  alt="National Card"
                  style={{
                    width: "200px", // Fixed width
                    height: "200px", // Fixed height
                    objectFit: "contain", // Keep aspect ratio
                    marginTop: "10px",
                  }}
                />
                <Box>
                  <input accept="image/*" type="file" id="national-id-image" style={{ display: "none" }} onChange={handleNationalIDImageChange} />
                  <label htmlFor="national-id-image">
                    <Fab color="secondary" component="span" aria-label="upload ID picture">
                      <PhotoCamera />
                    </Fab>
                  </label>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Update"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to save these changes?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setConfirmDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateSubmit} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
