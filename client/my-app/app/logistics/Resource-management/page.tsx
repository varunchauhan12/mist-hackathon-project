"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";

import { useEmergencies } from "@/hooks/useEmergencies";
import { useVehicles } from "@/hooks/useVehicles";
import { useMissions } from "@/hooks/useMissions";
import { Emergency, Vehicle } from "@/types";

/* ================= HELPERS ================= */
const priorityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "error";
    case "high":
      return "warning";
    case "medium":
      return "info";
    default:
      return "success";
  }
};

/* ================= PAGE ================= */
export default function ResourceAllocationPage() {
  const { emergencies } = useEmergencies();
  const { vehicles } = useVehicles();
  const { createMission } = useMissions();

  const [selectedEmergency, setSelectedEmergency] =
    useState<Emergency | null>(null);

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [eta, setEta] = useState("");

  /* ================= FILTERS ================= */
  const pendingEmergencies = emergencies.filter(
    (e) => e.status === "pending"
  );

  const availableVehicles = vehicles.filter(
    (v) => v.status === "available"
  );

  const vehiclesByType = (type: Vehicle["type"]) =>
    availableVehicles.filter((v) => v.type === type);

  /* ================= ACTION ================= */
  const handleAssignMission = async () => {
    if (!selectedEmergency || selectedVehicles.length === 0) return;

    await createMission({
      emergencyId: selectedEmergency._id,
      rescueTeamId: "AUTO_ASSIGN", // backend can decide
      vehiclesAssigned: selectedVehicles,
      eta,
    });

    setSelectedEmergency(null);
    setSelectedVehicles([]);
    setEta("");
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{
        background:
          "linear-gradient(135deg, #020617 0%, #0c4a6e 50%, #0f172a 100%)",
      }}
    >
      <Sidebar role="logistics" />

      <Box flex={1} p={4}>
        <Typography variant="h4" fontWeight="bold" color="#fff">
          Logistics Command Center
        </Typography>
        <Typography color="#67e8f9" mb={4}>
          Emergency → Mission → Vehicle Pipeline
        </Typography>

        <Grid container spacing={3}>
          {/* ================= LEFT COLUMN ================= */}
          <Grid item xs={12} md={5}>
            {/* EMERGENCIES */}
            <Card sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 3 }}>
              <CardContent>
                <Typography color="#fff" fontWeight={600} mb={2}>
                  Active Emergencies
                </Typography>

                <Stack spacing={2}>
                  {pendingEmergencies.map((e) => (
                    <Card
                      key={e._id}
                      onClick={() => setSelectedEmergency(e)}
                      sx={{
                        cursor: "pointer",
                        bgcolor:
                          selectedEmergency?._id === e._id
                            ? "rgba(34,211,238,0.2)"
                            : "rgba(255,255,255,0.05)",
                      }}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography color="#fff">
                            {e.type.toUpperCase()}
                          </Typography>
                          <Chip
                            label={e.severity}
                            color={priorityColor(e.severity)}
                            size="small"
                          />
                        </Stack>
                        <Typography color="#9ca3af" variant="body2">
                          {e.location.lat.toFixed(3)},{" "}
                          {e.location.lng.toFixed(3)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* ASSIGN MISSION */}
            <Card sx={{ bgcolor: "rgba(34,211,238,0.08)" }}>
              <CardContent>
                <Typography color="#fff" fontWeight={600} mb={2}>
                  Assign Mission
                </Typography>

                <Typography color="#9ca3af" mb={1}>
                  ETA
                </Typography>
                <input
                  type="datetime-local"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#020617",
                    color: "#fff",
                    border: "1px solid #334155",
                    borderRadius: 6,
                  }}
                />

                <Button
                  fullWidth
                  sx={{
                    mt: 3,
                    bgcolor: "#22d3ee",
                    color: "#020617",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#06b6d4" },
                  }}
                  disabled={!selectedEmergency || selectedVehicles.length === 0}
                  onClick={handleAssignMission}
                >
                  Dispatch Mission
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* ================= RIGHT COLUMN ================= */}
          <Grid item xs={12} md={7}>
            {/* VEHICLE STOCK */}
            <Grid container spacing={2} mb={3}>
              {["ambulance", "boat", "helicopter", "truck"].map((type) => {
                const available = vehiclesByType(type as any).length;
                const total = vehicles.filter((v) => v.type === type).length;

                return (
                  <Grid item xs={6} md={3} key={type}>
                    <Card sx={{ bgcolor: "rgba(255,255,255,0.05)" }}>
                      <CardContent>
                        <Typography color="#9ca3af" variant="overline">
                          {type}
                        </Typography>
                        <Typography color="#fff">
                          Available: {available}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={
                            total === 0
                              ? 0
                              : ((total - available) / total) * 100
                          }
                          sx={{
                            mt: 1,
                            bgcolor: "#1f2937",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#22d3ee",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* VEHICLE SELECT */}
            <Card sx={{ bgcolor: "rgba(255,255,255,0.05)" }}>
              <CardContent>
                <Typography color="#fff" fontWeight={600} mb={2}>
                  Allocate Vehicles
                </Typography>

                <Stack spacing={1}>
                  {availableVehicles.map((v) => (
                    <Card
                      key={v._id}
                      onClick={() =>
                        setSelectedVehicles((prev) =>
                          prev.includes(v._id)
                            ? prev.filter((id) => id !== v._id)
                            : [...prev, v._id]
                        )
                      }
                      sx={{
                        cursor: "pointer",
                        bgcolor: selectedVehicles.includes(v._id)
                          ? "rgba(34,211,238,0.2)"
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      <CardContent>
                        <Typography color="#fff">
                          {v.type.toUpperCase()} • {v.identifier}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
