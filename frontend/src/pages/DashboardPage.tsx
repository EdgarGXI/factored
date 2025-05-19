"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Briefcase, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllEmployees } from "../api/apiClient";
import type { Employee } from "../types";

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const adminEmail = sessionStorage.getItem("adminEmail");
    if (adminEmail !== "admin@factored.com") {
      navigate("/login");
      return;
    }

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const employees = await getAllEmployees();
        setEmployees(employees);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEmployeeClick = (id: number) => {
    // Add state parameter to tell the profile page where it was navigated from
    navigate(`/profile/${id}`, { state: { from: "dashboard" } });
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Factored Employee Directory
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {currentUser && (
              <Chip
                avatar={
                  <Avatar src={currentUser.avatar_url} alt={currentUser.name} />
                }
                label={`Logged in as ${currentUser.name}`}
                variant="outlined"
              />
            )}
            <Button
              variant="outlined"
              startIcon={<LogOut size={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search employees by name or position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : filteredEmployees.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No employees found matching your search.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredEmployees.map((employee) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={employee.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleEmployeeClick(employee.id)}
                    sx={{ height: "100%" }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                      }}
                    >
                      <Avatar
                        src={employee.avatar_url}
                        alt={employee.name}
                        sx={{ width: 100, height: 100, mb: 2, boxShadow: 2 }}
                      />
                      <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        align="center"
                      >
                        {employee.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "text.secondary",
                          mb: 2,
                        }}
                      >
                        <Briefcase size={16} />
                        <Typography variant="body2">
                          {employee.position}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: "auto" }}>
                        <Chip
                          label={`${
                            Object.keys(employee.skills).length
                          } skills`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage;
