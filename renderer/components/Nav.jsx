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
const title = "PS Park";

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
    label: "Generate Billing",
    link: "/generatebilling",
    icon: <ReceiptIcon />,
  },
  {
    label: "Enter Billing Details",
    link: "/billingdetails",
    icon: <ReceiptLongIcon />,
  },
  { label: "Printing/payment", link: "/printpayment", icon: <PrintIcon /> },
  {
    label: "Generate Contract",
    link: "/generatecontract",
    icon: <GavelIcon />,
  },
];
const navigationItems5 = [
  {
    label: "Billing Report",
    link: "/Summarybilling",
    icon: <AssessmentIcon />,
  },
  { label: "Meter/Water", link: "/SummaryMeter", icon: <ElectricMeterIcon /> },
  { label: "Request", link: "/Feedback", icon: <FeedbackIcon /> },
];
const navigationItems6 = [
  { label: "Profile", link: "/profile", icon: <AccountCircleIcon /> },
  { label: "Logout", link: "/home", icon: <LogoutIcon /> },
];

export default function Nav() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [activeLink, setActiveLink] = React.useState("/dashboard"); // Set the default active link

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const router = useRouter();

  const handleLogout = () => {
    // Clear the session
    localStorage.removeItem("isLoggedIn");

    // Redirect to the login page
    router.push("/home");
  };

  const isLinkActive = (link) => link === activeLink;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
      <DrawerHeader>
  {open ? (
    // Replace the text with an image
    
      <img
        src="logo.png" // Provide the correct path to your PNG image
        alt="Logo"
        style={{ width: "100%" }}
      />
    
  ) : null}
  <IconButton onClick={() => setOpen(!open)}>
    {theme.direction === "rtl" ? (
      <ChevronRightIcon />
    ) : (
      <ChevronLeftIcon />
    )}
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
                    backgroundColor: isLinkActive(item.link)
                      ? theme.palette.action.selected
                      : "transparent",
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
                      color: isLinkActive(item.link)
                        ? theme.palette.primary.main
                        : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        <Divider>
          {open && (
            <div style={{ opacity: "60%", fontSize: "13px" }}>Master Data</div>
          )}
        </Divider>
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
                    backgroundColor: isLinkActive(item.link)
                      ? theme.palette.action.selected
                      : "transparent",
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
                      color: isLinkActive(item.link)
                        ? theme.palette.primary.main
                        : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>
          {open && (
            <div style={{ opacity: "60%", fontSize: "13px" }}>
              Check-In/Check-Out
            </div>
          )}
        </Divider>
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
                    backgroundColor: isLinkActive(item.link)
                      ? theme.palette.action.selected
                      : "transparent",
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
                      color: isLinkActive(item.link)
                        ? theme.palette.primary.main
                        : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>
          {open && (
            <div style={{ opacity: "60%", fontSize: "13px" }}>Operation</div>
          )}
        </Divider>
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
                    backgroundColor: isLinkActive(item.link)
                      ? theme.palette.action.selected
                      : "transparent",
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
                      color: isLinkActive(item.link)
                        ? theme.palette.primary.main
                        : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>
          {open && (
            <div style={{ opacity: "60%", fontSize: "13px" }}>Report</div>
          )}
        </Divider>
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
                    backgroundColor: isLinkActive(item.link)
                      ? theme.palette.action.selected
                      : "transparent",
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
                      color: isLinkActive(item.link)
                        ? theme.palette.primary.main
                        : "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider>
          {open && (
            <div style={{ opacity: "60%", fontSize: "13px" }}>Account</div>
          )}
        </Divider>
        {/* <List>
          {navigationItems6.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <Link href={item.link} passHref>
              <ListItemButton
                component="a"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: isLinkActive(item.link) ? theme.palette.action.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => handleLinkClick(item.link)}
              >
                   <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isLinkActive(item.link) ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List> */}
        <List>
  {navigationItems6.map((item, index) => (
    <ListItem key={index} disablePadding sx={{ display: "block" }}>
      <Link href={item.link} passHref>
        <ListItemButton
          component="a"
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            backgroundColor: isLinkActive(item.link)
              ? theme.palette.action.selected
              : "transparent",
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
              color: isLinkActive(item.link)
                ? theme.palette.primary.main
                : "rgba(0, 0, 0, 0.87)",
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </Link>
    </ListItem>
  ))}
</List>
        {/* Additional list items can be added here */}
      </Drawer>
    </Box>
  );
}
