"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { Employee } from "../types";
import { useAuth } from "../context/AuthContext";
import { getEmployeeProfile } from "../api/apiClient";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchEmployeeData() {
      if (!id) return;

      try {
        setLoading(true);
        const employeeId = parseInt(id);
        const data = await getEmployeeProfile(employeeId);
        setEmployee(data);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError("Failed to load employee data");
        // Consider redirecting to error page
      } finally {
        setLoading(false);
      }
    }

    fetchEmployeeData();
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!employee) {
    return null;
  }

  // Transform skills data for the radar chart
  const skillsData = Object.entries(employee.skills).map(([name, level]) => ({
    subject: name,
    A: level,
    fullMark: 100,
  }));

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={employee.avatar_url}
                alt={employee.name}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" component="h1" gutterBottom>
                {employee.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {employee.position}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {employee.email}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h6" gutterBottom>
                Skills Assessment
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={skillsData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name={employee.name}
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Skills Breakdown
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(employee.skills).map(([name, level]) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1">{name}</Typography>
                    <Box
                      sx={{
                        height: 8,
                        width: "100%",
                        bgcolor: "grey.300",
                        borderRadius: 5,
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${level}%`,
                          bgcolor: "primary.main",
                          borderRadius: 5,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {level}/100
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfilePage;
