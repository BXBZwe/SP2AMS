// import { signOut } from "next-auth/react";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PrintIcon from "@mui/icons-material/Print";
import GavelIcon from "@mui/icons-material/Gavel";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu"; // Import the MenuIcon
<<<<<<< HEAD
import AssignmentIcon from '@mui/icons-material/Assignment';
const drawerWidth = 240;
const isActive = (link) => {
  return router.pathname === link;
};
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
=======

// const drawerWidth = 240;
// // const isActive = (link) => {
// //   return router.pathname === link;
// // };
// const openedMixin = (theme) => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });
>>>>>>> 84483a20fa5b0128eed0bf200cb9e9c192b1282c

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
//   justifyContent: "flex-end", // Center the content horizontally
// }));

// const TitleWrapper = styled("div")(({ theme }) => ({
//   flex: 1, // Take up all available space
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center", // Center the content horizontally
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));
// // const title = "PS Park";

<<<<<<< HEAD
const navigationItems1 = [
  // { label: "Dashboard (Home)", link: "/dashboard", icon: <DashboardIcon /> },
  { label: "Dashboard (Home)", link: "/home", icon: <DashboardIcon /> },
];
const navigationItems2 = [
  {
    label: "Rate Maintenance",
    link: "/rateMaintenance",
    icon: <MenuBookIcon />,
  },
  { label: "Room Maintenance", link: "/roomMaintenance", icon: <HomeIcon /> },
  {
    label: "Tenant Maintenance",
    link: "/tenantMaintenance",
    icon: <GroupsIcon />,
  },
];
const navigationItems3 = [
  { label: "Check-In", link: "/checkIn", icon: <HowToRegIcon /> },
  { label: "Check-Out", link: "/checkOut", icon: <ExitToAppIcon /> },
];
const navigationItems4 = [
  {
    label: "Generate Contract",
    link: "/generatecontract",
    icon: <GavelIcon />,
  },
  {
    label: "Generate Billing Date",
    link: "/generatebilling",
    icon: <ReceiptIcon />,
  },
  {
    label: "Enter Billing Details",
    link: "/billingdetails",
    icon: <ReceiptLongIcon />,
  },
  {
    label: "Summary Billing Detail",
    link: "/SummaryBillingDetail",
    icon: <AssignmentIcon />,
  },
  { label: "Printing/Payment", link: "/printpayment", icon: <PrintIcon /> },
];
const navigationItems5 = [
  {
    label: "Accural Billing Report",
    link: "/Summaryperiodicbilling",
    icon: <AssessmentIcon />,
  },
  {
    label: "Periodic Billing Report",
    link: "/Summaryaccuralbilling",
    icon: <AssessmentIcon />,
  },
  { label: "Meter/Water", link: "/SummaryMeter", icon: <ElectricMeterIcon /> },
  { label: "Request", link: "/Feedback", icon: <FeedbackIcon /> },
];
const navigationItems6 = [
  { label: "Profile", link: "/profile", icon: <AccountCircleIcon /> },
  { label: "Logout", action: () => signOut({ callbackUrl: "/signin" }), icon: <LogoutIcon /> },
];
=======
// const navigationItems1 = [
//   // { label: "Dashboard (Home)", link: "/dashboard", icon: <DashboardIcon /> },
//   { label: "Dashboard (Home)", link: "/home", icon: <DashboardIcon /> },
// ];
// const navigationItems2 = [
//   {
//     label: "Rate Maintenance",
//     link: "/rateMaintenance",
//     icon: <MenuBookIcon />,
//   },
//   { label: "Room Maintenance", link: "/roomMaintenance", icon: <HomeIcon /> },
//   {
//     label: "Tenant Maintenance",
//     link: "/tenantMaintenance",
//     icon: <GroupsIcon />,
//   },
// ];
// const navigationItems3 = [
//   { label: "Check-In", link: "/checkIn", icon: <HowToRegIcon /> },
//   { label: "Check-Out", link: "/checkOut", icon: <ExitToAppIcon /> },
// ];
// const navigationItems4 = [
//   {
//     label: "Generate Contract",
//     link: "/generatecontract",
//     icon: <GavelIcon />,
//   },
//   {
//     label: "Generate Billing Date",
//     link: "/generatebilling",
//     icon: <ReceiptIcon />,
//   },
//   {
//     label: "Enter Billing Details",
//     link: "/billingdetails",
//     icon: <ReceiptLongIcon />,
//   },
//   {
//     label: "Summary Billing Detail",
//     link: "/SummaryBillingDetail",
//     icon: <ReceiptIcon />,
//   },
//   { label: "Printing/Payment", link: "/printpayment", icon: <PrintIcon /> },
// ];
// const navigationItems5 = [
//   {
//     label: "Accural Billing Report",
//     link: "/Summaryperiodicbilling",
//     icon: <AssessmentIcon />,
//   },
//   {
//     label: "Periodic Billing Report",
//     link: "/Summaryaccuralbilling",
//     icon: <AssessmentIcon />,
//   },
//   { label: "Meter/Water", link: "/SummaryMeter", icon: <ElectricMeterIcon /> },
//   { label: "Request", link: "/Feedback", icon: <FeedbackIcon /> },
// ];
// const navigationItems6 = [
//   { label: "Profile", link: "/profile", icon: <AccountCircleIcon /> },
//   { label: "Logout", action: handleLogout, icon: <LogoutIcon /> },
// ];
>>>>>>> 84483a20fa5b0128eed0bf200cb9e9c192b1282c

export default function Nav() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [activeLink, setActiveLink] = React.useState("/dashboard"); // Set the default active link

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the stored token
    router.push("/signin"); // Redirect to login page
  };

  const isLinkActive = (link) => link === activeLink;

  const drawerWidth = 240;
  // const isActive = (link) => {
  //   return router.pathname === link;
  // };
  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end", // Center the content horizontally
  }));

  const TitleWrapper = styled("div")(({ theme }) => ({
    flex: 1, // Take up all available space
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center the content horizontally
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));
  // const title = "PS Park";

  const navigationItems1 = [
    // { label: "Dashboard (Home)", link: "/dashboard", icon: <DashboardIcon /> },
    { label: "Dashboard (Home)", link: "/home", icon: <DashboardIcon /> },
  ];
  const navigationItems2 = [
    {
      label: "Rate Maintenance",
      link: "/rateMaintenance",
      icon: <MenuBookIcon />,
    },
    { label: "Room Maintenance", link: "/roomMaintenance", icon: <HomeIcon /> },
    {
      label: "Tenant Maintenance",
      link: "/tenantMaintenance",
      icon: <GroupsIcon />,
    },
  ];
  const navigationItems3 = [
    { label: "Check-In", link: "/checkIn", icon: <HowToRegIcon /> },
    { label: "Check-Out", link: "/checkOut", icon: <ExitToAppIcon /> },
  ];
  const navigationItems4 = [
    {
      label: "Generate Contract",
      link: "/generatecontract",
      icon: <GavelIcon />,
    },
    {
      label: "Generate Billing Date",
      link: "/generatebilling",
      icon: <ReceiptIcon />,
    },
    {
      label: "Enter Billing Details",
      link: "/billingdetails",
      icon: <ReceiptLongIcon />,
    },
    {
      label: "Summary Billing Detail",
      link: "/SummaryBillingDetail",
      icon: <ReceiptIcon />,
    },
    { label: "Printing/Payment", link: "/printpayment", icon: <PrintIcon /> },
  ];
  const navigationItems5 = [
    {
      label: "Accural Billing Report",
      link: "/Summaryperiodicbilling",
      icon: <AssessmentIcon />,
    },
    {
      label: "Periodic Billing Report",
      link: "/Summaryaccuralbilling",
      icon: <AssessmentIcon />,
    },
    { label: "Meter/Water", link: "/SummaryMeter", icon: <ElectricMeterIcon /> },
    { label: "Request", link: "/Feedback", icon: <FeedbackIcon /> },
  ];
  const navigationItems6 = [
    { label: "Profile", link: "/profile", icon: <AccountCircleIcon /> },
    { label: "Logout", action: handleLogout, icon: <LogoutIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <div style={{ display: "flex", alignItems: "center", marginRight: "25px" }}>
            <Image src="/logo.png" alt="PS Park Logo" width={50} height={50} />
            <Typography variant="h6" noWrap sx={{ ml: 1, fontWeight: "bold" }}>
              PS Park
            </Typography>
          </div>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              ...(open && {
                justifyContent: "flex-end",
              }),
              ...(!open && {
                marginRight: "0", // Aligns the icon to the center when drawer is closed
                // Centers the icon when drawer is closed
              }),
            }}
          >
            {open ? theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <List>
          {navigationItems1.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <Link href={item.link} passHref>
                <ListItemButton
                  component="a"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleLinkClick(item.link)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isLinkActive(item.link) ? theme.palette.primary.main : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        <Divider>{open && <div style={{ opacity: "60%", fontSize: "13px" }}>Master Data</div>}</Divider>
        <List>
          {navigationItems2.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <Link href={item.link} passHref>
                <ListItemButton
                  component="a"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleLinkClick(item.link)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isLinkActive(item.link) ? theme.palette.primary.main : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>{open && <div style={{ opacity: "60%", fontSize: "13px" }}>Check-In/Check-Out</div>}</Divider>
        <List>
          {navigationItems3.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <Link href={item.link} passHref>
                <ListItemButton
                  component="a"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleLinkClick(item.link)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isLinkActive(item.link) ? theme.palette.primary.main : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>{open && <div style={{ opacity: "60%", fontSize: "13px" }}>Operation</div>}</Divider>
        <List>
          {navigationItems4.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <Link href={item.link} passHref>
                <ListItemButton
                  component="a"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleLinkClick(item.link)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isLinkActive(item.link) ? theme.palette.primary.main : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>{open && <div style={{ opacity: "60%", fontSize: "13px" }}>Report</div>}</Divider>
        <List>
          {navigationItems5.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <Link href={item.link} passHref>
                <ListItemButton
                  component="a"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleLinkClick(item.link)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isLinkActive(item.link) ? theme.palette.primary.main : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>{open && <div style={{ opacity: "60%", fontSize: "13px" }}>Account</div>}</Divider>
        <List>
          {navigationItems6.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              {item.action ? (
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={item.action}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isLinkActive(item.link) ? theme.palette.primary.main : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              ) : (
                <Link href={item.link} passHref>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : "transparent",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => item.link !== "/home" && handleLinkClick(item.link)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: isLinkActive(item.link) ? theme.palette.primary.main : "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </Link>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
