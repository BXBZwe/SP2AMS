import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Avatar, Stack, IconButton, TextField, Button } from "@mui/material";
import Head from "next/head";
import { deepOrange } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Profile() {
  const [manager, setManager] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [isEditingEmailKey, setIsEditingEmailKey] = useState(false);
  const [editableName, setEditableName] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editablePhoneNumber, setEditablePhoneNumber] = useState("");
  const [editableEmailKey, setEditableEmailKey] = useState("");

  useEffect(() => {
    async function fetchManagerData() {
      try {
        const response = await fetch("http://localhost:3000/manager");
        const data = await response.json();
        setManager(data.manager);
        // Set the initial values for the editable states
        setEditableName(data.manager.name);
        setEditableEmail(data.manager.email);
        setEditablePhoneNumber(data.manager.phone_number || "");
        setEditableEmailKey(data.manager.email_key || "");
      } catch (error) {
        console.error("Failed to fetch manager data:", error);
      }
    }

    fetchManagerData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!manager) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async () => {
    try {
      const body = {
        manager_id: manager.manager_id,
        name: editableName,
        email: editableEmail,
        email_key: editableEmailKey,
        phone_number: editablePhoneNumber,
      };
      const response = await fetch("http://localhost:3000/updatemanager", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Failed to update manager");
      }
      const updatedManager = await response.json();
      setManager(updatedManager.manager);

      // Reset editing state here, after the update is successful
      setIsEditingName(false);
      setIsEditingEmail(false);
      setIsEditingPhoneNumber(false);
      setIsEditingEmailKey(false);
      // Clear new password field after successful update
    } catch (error) {
      console.error("Failed to update manager:", error);
    }
  };

  const handleCancel = () => {
    setEditableName(manager.name);
    setEditableEmail(manager.email);
    setEditablePhoneNumber(manager.phone_number || "");
    setEditableEmailKey(manager.email_key || "");
    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingPhoneNumber(false);
    setIsEditingEmailKey(false);
  };

  return (
    <div>
      <Head>
        <title>Profile Detail</title>
      </Head>

      <Card sx={{ width: "100%" }}>
        <CardContent
          sx={{
            marginRight: "auto",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h4">Profile</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Manage Profile and Email Settings
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex" }}>
          <CardContent sx={{ display: "inline-block" }}>
            <Stack direction="row" spacing={2}>
              <Avatar sx={{ bgcolor: deepOrange[500], width: 210, height: 210 }} variant="square">
                {manager.name.charAt(0)}
              </Avatar>
            </Stack>
          </CardContent>
          <CardContent>
            <Typography variant="h6">
              <b>Name</b>
              <EditIcon sx={{ width: 18 }} onClick={() => setIsEditingName(true)} />
            </Typography>
            {isEditingName ? (
              <TextField value={editableName} onChange={(e) => setEditableName(e.target.value)} />
            ) : (
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {manager.name}
              </Typography>
            )}

            <Typography variant="h6">
              <b>Email</b>
              <EditIcon sx={{ width: 18 }} onClick={() => setIsEditingEmail(true)} />
            </Typography>
            {isEditingEmail ? (
              <TextField value={editableEmail} onChange={(e) => setEditableEmail(e.target.value)} />
            ) : (
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {manager.email}
              </Typography>
            )}

            <Typography variant="h6">
              <b>Email Key</b>
              <EditIcon sx={{ width: 18 }} onClick={() => setIsEditingEmailKey(true)} />
            </Typography>
            {isEditingEmailKey ? (
              <TextField value={editableEmailKey} onChange={(e) => setEditableEmailKey(e.target.value)} />
            ) : (
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {manager.email_key}
              </Typography>
            )}

            <Typography variant="h6">
              <b>Telephone</b>
              <EditIcon sx={{ width: 18 }} onClick={() => setIsEditingPhoneNumber(true)} />
            </Typography>
            {isEditingPhoneNumber ? (
              <TextField value={editablePhoneNumber} onChange={(e) => setEditablePhoneNumber(e.target.value)} />
            ) : (
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {manager.phone_number}
              </Typography>
            )}
          </CardContent>
        </Box>
      </Card>
      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <Typography variant="h6">
            <b>Change Password</b>
          </Typography>
          <form>
            <Stack spacing={1} direction="row" alignItems="center">
              <TextField type={showPassword ? "text" : "password"} value={manager.password_hash} variant="outlined" disabled />
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {(isEditingName || isEditingEmail || isEditingPhoneNumber || isEditingEmailKey) && (
        <Box display="flex" justifyContent="flex-end" m={2}>
          <Button color="primary" variant="outlined" onClick={handleCancel} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Box>
      )}
    </div>
  );
}
