"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";

/* ================= TYPES ================= */
interface ResourceAllocation {
  id: string;
  vehicleType: "ambulance" | "boat" | "helicopter" | "truck";
  quantity: number;
  zone: string;
  priority: "low" | "medium" | "high" | "critical";
  assignedTeam?: string;
  estimatedArrival?: string;
  status: "pending" | "dispatched" | "active" | "completed";
}

interface VehicleStock {
  type: "ambulance" | "boat" | "helicopter" | "truck";
  total: number;
  available: number;
  allocated: number;
}

/* ================= CONSTANTS ================= */
const VEHICLE_STOCK: VehicleStock[] = [
  { type: "ambulance", total: 24, available: 18, allocated: 6 },
  { type: "boat", total: 12, available: 9, allocated: 3 },
  { type: "helicopter", total: 6, available: 4, allocated: 2 },
  { type: "truck", total: 18, available: 14, allocated: 4 },
];

const ZONES = [
  "North Zone",
  "South Zone",
  "East Zone",
  "West Zone",
  "Central Zone",
  "Coastal Area",
  "Mountain Region",
];

const TEAMS = [
  "Alpha Team",
  "Bravo Team",
  "Charlie Team",
  "Delta Team",
  "Echo Team",
];

/* ================= HELPERS ================= */
const priorityColor = (
  p: ResourceAllocation["priority"]
): "error" | "warning" | "info" | "success" => {
  switch (p) {
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
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [vehicleType, setVehicleType] =
    useState<ResourceAllocation["vehicleType"]>("ambulance");
  const [quantity, setQuantity] = useState(1);
  const [zone, setZone] = useState(ZONES[0]);
  const [priority, setPriority] =
    useState<ResourceAllocation["priority"]>("medium");
  const [assignedTeam, setAssignedTeam] = useState(TEAMS[0]);
  const [estimatedArrival, setEstimatedArrival] = useState("");

  const handleAdd = () => {
    setAllocations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        vehicleType,
        quantity,
        zone,
        priority,
        assignedTeam,
        estimatedArrival,
        status: "pending",
      },
    ]);
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
        {/* HEADER */}
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff" }}>
          Resource Allocation Center
        </Typography>
        <Typography sx={{ color: "#67e8f9", mb: 4 }}>
          Dynamic vehicle distribution & dispatch management
        </Typography>

        {/* VEHICLE STOCK */}
        <Grid container spacing={3} mb={4}>
          {VEHICLE_STOCK.map((v) => (
            <Grid item xs={12} sm={6} md={3} key={v.type}>
              <Card
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="overline" sx={{ color: "#9ca3af" }}>
                    {v.type}
                  </Typography>
                  <Typography sx={{ color: "#fff", mb: 1 }}>
                    Available: {v.available}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(v.allocated / v.total) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#1f2937",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#22d3ee",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* FORM */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: "rgba(34,211,238,0.08)",
                borderRadius: 3,
                border: "1px solid rgba(34,211,238,0.3)",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                  New Allocation
                </Typography>

                <Stack spacing={2}>
                  <Select
                    fullWidth
                    value={vehicleType}
                    onChange={(e) =>
                      setVehicleType(
                        e.target.value as ResourceAllocation["vehicleType"]
                      )
                    }
                    sx={{ color: "#fff" }}
                  >
                    {["ambulance", "boat", "helicopter", "truck"].map((v) => (
                      <MenuItem key={v} value={v}>
                        {v}
                      </MenuItem>
                    ))}
                  </Select>

                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    InputLabelProps={{ sx: { color: "#9ca3af" } }}
                    sx={{
                      input: { color: "#fff" },
                    }}
                  />

                  <Select
                    fullWidth
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    sx={{ color: "#fff" }}
                  >
                    {ZONES.map((z) => (
                      <MenuItem key={z} value={z}>
                        {z}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    fullWidth
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value as ResourceAllocation["priority"]
                      )
                    }
                    sx={{ color: "#fff" }}
                  >
                    {["low", "medium", "high", "critical"].map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    fullWidth
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value)}
                    sx={{ color: "#fff" }}
                  >
                    {TEAMS.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>

                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="ETA"
                    InputLabelProps={{ shrink: true, sx: { color: "#9ca3af" } }}
                    value={estimatedArrival}
                    onChange={(e) => setEstimatedArrival(e.target.value)}
                    sx={{ input: { color: "#fff" } }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAdd}
                    sx={{
                      bgcolor: "#22d3ee",
                      color: "#020617",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#06b6d4",
                      },
                    }}
                  >
                    Add Allocation
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* ALLOCATIONS */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {allocations.length === 0 ? (
                <Typography sx={{ color: "#9ca3af" }}>
                  No allocations created yet
                </Typography>
              ) : (
                allocations.map((a) => (
                  <Card
                    key={a.id}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography sx={{ color: "#fff" }}>
                          {a.vehicleType} × {a.quantity}
                        </Typography>
                        <Chip
                          label={a.priority}
                          color={priorityColor(a.priority)}
                          size="small"
                        />
                      </Stack>
                      <Typography sx={{ color: "#9ca3af" }} variant="body2">
                        {a.zone} • {a.assignedTeam}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
