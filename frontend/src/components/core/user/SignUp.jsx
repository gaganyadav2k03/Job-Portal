import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const skillOptions = ["JavaScript", "React", "Node.js", "Python", "Java"];

export default function SignUp() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("jobSeeker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skills, setSkills] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    education: "",
    experience: "",
    company: "",
  });

  const handleToggle = (e, newType) => {
    if (newType !== null) setAccountType(newType);
  };

  const handleSkillChange = (e) => {
    const { value } = e.target;
    setSkills(typeof value === "string" ? value.split(",") : value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );
      payload.append("skills", skills.join(","));
      payload.append("accountType", accountType);
      if (profileImage) payload.append("profileImage", profileImage);

      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10, height: "100vh" }}>
      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <ToggleButtonGroup
              value={accountType}
              exclusive
              color="primary"
              onChange={handleToggle}
              sx={{
                borderRadius: 2,
                "& .MuiToggleButton-root": {
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  fontSize: "0.9rem",
                },
              }}
            >
              <ToggleButton value="jobSeeker">Job Seeker</ToggleButton>
              <ToggleButton value="employer">Employer</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              type="email"
            />
            <TextField
              name="contactNumber"
              label="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <FormControl fullWidth>
              <InputLabel shrink>Upload Profile Image</InputLabel>
              <OutlinedInput
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={(e) => setProfileImage(e.target.files[0])}
                notched
                label="Upload Profile Image"
                endAdornment={
                  <IoCloudUploadOutline
                    style={{ marginLeft: 8, fontSize: 24, color: "#888" }}
                  />
                }
              />
            </FormControl>

            {accountType === "jobSeeker" && (
              <>
                <TextField
                  name="education"
                  label="Education"
                  value={formData.education}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <FormControl fullWidth>
                  <InputLabel>Skills</InputLabel>
                  <Select
                    multiple
                    value={skills}
                    onChange={handleSkillChange}
                    input={<OutlinedInput label="Skills" />}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {skillOptions.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Experience dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    label="Experience Level"
                  >
                    <MenuItem value="fresher">Fresher</MenuItem>
                    <MenuItem value="1-3 years">1-3 years</MenuItem>
                    <MenuItem value="3-5 years">3-5 years</MenuItem>
                    <MenuItem value="5+ years">5+ years</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {accountType === "employer" && (
              <TextField
                name="company"
                label="Company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
                required
              />
            )}

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="warning"
                sx={{ px: 5, py: 1.2, fontWeight: "bold" }}
              >
                CREATE ACCOUNT
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
