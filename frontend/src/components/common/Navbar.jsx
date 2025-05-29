import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing user directly from Redux state
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");

  const open = Boolean(anchorEl);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.map((n) => n.charAt(0).toUpperCase()).join("");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logout());
    handleMenuClose();
    navigate("/login");
  };

  // const handleSearch = () => {
  //   if (searchText.trim()) {
  //     navigate(`/search?query=${encodeURIComponent(searchText)}`);
  //   }
  // };

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchText)}`);
    }
  };

  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? "#1976d2" : "#2a2a2a",
    textDecoration: "none",
    fontWeight: isActive ? "bold" : "medium",
    fontSize: isActive ? "h6.fontSize" : "default",
    display: "flex",
    alignItems: "center",
  });

  return (
    <AppBar position="static" color="default" elevation={3}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            height: 75,
          }}
        >
          {/* Brand */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Job Portal
            </Link>
          </Typography>

          {/* Center Nav */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            <NavLink to="/" style={navLinkStyles}>
              Home
            </NavLink>
            <NavLink to="/jobs" style={navLinkStyles}>
              Jobs
            </NavLink>

            <Paper
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              sx={{
                p: "2px 8px",
                display: "flex",
                alignItems: "center",
                width: 350,
                borderRadius: 1.5,
                boxShadow: 0,
                border: "1px solid #ccc",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for jobs, location and comapny"
                inputProps={{ "aria-label": "search jobs" }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: "6px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>

          {/* Right Side: Profile or Auth Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <Typography variant="body1" fontWeight="500">
                  {user?.firstName}
                </Typography>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    src={user?.profileImage || ""}
                    sx={{
                      bgcolor: !user?.profileImage ? "#f57c00" : "transparent",
                    }}
                  >
                    {!user?.profileImage &&
                      getInitials(user?.firstName + " " + user?.lastName)}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  sx={{ px: 8, justifyContent: "center" }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/dashboard"
                    onClick={handleMenuClose}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>
                <Button component={Link} to="/signup" color="inherit">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
