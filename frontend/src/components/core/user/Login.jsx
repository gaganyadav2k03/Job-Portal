import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        console.log("user data: ", data.user);

        dispatch(loginSuccess({ user: data.user, token: data.token }));

        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="h-[100vh]">
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          py: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", p: 2, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              fontWeight="bold"
              mb={2}
            >
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "grid", gap: 2 }}
            >
              <TextField
                label="Email Address"
                name="email"
                fullWidth
                required
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="warning"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{ fontWeight: "bold", py: 1.2 }}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
