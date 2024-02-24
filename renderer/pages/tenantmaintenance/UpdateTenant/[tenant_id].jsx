import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Card, CardContent, Typography, Box, Button, Select, MenuItem, IconButton } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useRouter } from "next/router";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function updatetenant() {
  const router = useRouter();
  const { tenant_id } = router.query;
  const paymentOptions = ["Select", "EMAIL", "PAPER", "BOTH"];
  const [accountStatus, setAccountStatus] = useState("ACTIVE");
  // const [tenantImagePreview, setTenantImagePreview] = useState(null);
  // const [nationalIDImagePreview, setNationalIDImagePreview] = useState(null);
  const [tenantImage, settenantImage] = useState(null);
  const [NationalCardImage, setNationalCardImage] = useState(null);

  const type = [{ label: "+93" }, { label: "+66" }, { label: "+10" }];
  const [tenantData, setTenantData] = useState({
    first_name: "",
    last_name: "",
    personal_id: "",
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
          tenant_image: tenantImageUrl,
          nationalcard_image: nationalCardImageUrl,
          invoice_option: tenant.invoice_option,
          addresses: tenant.addresses || { addressnumber: "", street: "", sub_district: "", district: "", province: "", postal_code: "" },
          contacts: tenant.contacts || { phone_number: "", email: "", line_id: "", eme_name: "", eme_phone: "", eme_line_id: "", eme_relation: "" },
        });
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      }
    };
    fetchTenantData();
  }, [tenant_id]);

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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
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

    try {
      const response = await axios.put(`http://localhost:3000/updatetenants/${tenant_id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Tenant updated successfully:", response.data);
        setMessage("Tenant updated successfully");
      } else {
        throw new Error("An error occurred while updating the tenant");
      }
    } catch (error) {
      console.error("Error updating tenant:", error);
      setMessage(error.response?.data?.message || error.message || "An error occurred");
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
          <Button type="submit" variant="contained" sx={{ width: "110px", marginTop: "15px" }} component="a" onClick={handleUpdateSubmit} disabled={loading}>
            {loading ? "Adding..." : "Save"}
          </Button>
          <Button variant="contained" color={accountStatus === "ACTIVE" ? "success" : "secondary"} onClick={() => setAccountStatus(accountStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")} sx={{ margin: "10px" }}>
            {accountStatus}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", height: "90%" }}>
        <Card sx={{ width: "100%", marginBottom: "10px" }}>
          <CardContent>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Tenant Details
            </Typography>

            <TextField id="first_name" name="first_name" label="First Name" value={tenantData.first_name} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            <TextField id="last_name" name="last_name" label="Last Name" value={tenantData.last_name} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            <br></br>

            <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="Male" name="radio-buttons-group" sx={{ display: "inline" }}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>

            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <TextField id="personal_id" name="personal_id" label="Personal ID" value={tenantData.personal_id} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />

              <Autocomplete disablePortal id="combo-box-demo" options={type} sx={{ width: 90, marginBottom: 1.5, marginRight: 0.5 }} renderInput={(params) => <TextField {...params} label="Code" />} />
              <TextField id="phone_number" name="contacts.phone_number" label="Phone Number" value={tenantData.contacts.phone_number} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.6 }} />
            </Box>

            <Select label="Invoice Option" id="invoice_option" value={tenantData.invoice_option} onChange={(e) => setTenantData({ ...tenantData, invoice_option: e.target.value })} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }}>
              {paymentOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <TextField id="email" name="contacts.email" label="Email" variant="outlined" value={tenantData.contacts.email} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <TextField id="line_id" name="contacts.line_id" label="Line ID" variant="outlined" value={tenantData.contacts.line_id} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <Typography sx={{ marginBottom: 1, marginTop: "10px" }}>Address</Typography>
            <TextField id="addressnumber" name="addresses.addressnumber" label="Soi" variant="outlined" value={tenantData.addresses.addressnumber} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />
            <TextField id="street" name="addresses.street" label="Street" variant="outlined" value={tenantData.addresses.street} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />

            <TextField id="district" name="addresses.district" label="District" value={tenantData.addresses.district} onChange={handleChange} variant="outlined" sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <br></br>
            <TextField id="province" name="addresses.province" label="Province" variant="outlined" value={tenantData.addresses.province} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />

            <TextField id="postal_code" name="addresses.postal_code" label="Postal Code" value={tenantData.addresses.postal_code} variant="outlined" onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <br></br>
            <TextField id="sub_district" name="addresses.sub_district" label="Sub District" variant="outlined" value={tenantData.addresses.sub_district} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 5 }} />
          </CardContent>
          <Box sx={{ marginBottom: 2, marginLeft: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Emergency Contact
            </Typography>
            <TextField id="eme_name" name="contacts.eme_name" label="Full Name" variant="outlined" value={tenantData.contacts.eme_name} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />
            <TextField id="eme_phone" name="contacts.eme_phone" label="Phone Number" variant="outlined" value={tenantData.contacts.eme_phone} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
            <TextField id="eme_line_id" name="contacts.eme_line_id" label="Line ID" variant="outlined" value={tenantData.contacts.eme_line_id} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 2.5 }} />
            <TextField id="eme_relation" name="contacts.eme_relation" label="Relationship" variant="outlined" value={tenantData.contacts.eme_relation} onChange={handleChange} sx={{ width: 270, marginBottom: 1.5, marginRight: 0.5 }} />
          </Box>
        </Card>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
          <Card sx={{ display: "inline-block", width: "28vw", marginLeft: 2, marginBottom: "10px", height: "auto" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography sx={{ textAlign: "center", marginBottom: 0.3, fontWeight: "bold", fontSize: "19px" }}>Tenant Image</Typography>
              <Typography sx={{ textAlign: "center", margin: 0, opacity: "50%" }}>Attach a picture of tenant</Typography>
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 10 }}>
                <input accept="image/*" type="file" id="tenant-image" style={{ display: "none" }} onChange={handleTenantImageChange} />
                <label htmlFor="tenant-image">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <img src={tenantData.tenant_image} alt="Tenant" width="200" height="auto" />
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ display: "inline-block", width: "28vw", marginLeft: 2, marginBottom: "10px", height: "auto" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography sx={{ textAlign: "center", marginBottom: 0.3, fontWeight: "bold", fontSize: "19px" }}>National Thai Citizen ID or Passport</Typography>
              <Typography sx={{ textAlign: "center", margin: 0, opacity: "50%" }}>Attach a copy of the tenant Identification</Typography>
              <Box sx={{ "& > :not(style)": { m: 1 }, marginTop: 10 }}>
                <input accept="image/*" type="file" id="national-id-image" style={{ display: "none" }} onChange={handleNationalIDImageChange} />
                <label htmlFor="national-id-image">
                  <IconButton color="primary" aria-label="upload ID picture" component="span">
                    <img src={tenantData.nationalcard_image} alt="National Card" width="200" height="auto" />

                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}