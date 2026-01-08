"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import EmergencyInstructions from "@/components/Emergency";
import { Truck, Activity, Wrench, Send } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { useEmergencies } from "@/hooks/useEmergencies";
import { useVehicles } from "@/hooks/useVehicles";
import { useMissions } from "@/hooks/useMissions";
import { Emergency, Vehicle, VehicleStatus } from "@/types";

/* ---------- STYLES ---------- */
const statusStyle: Record<VehicleStatus, string> = {
  available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  "in-use": "bg-amber-500/20 text-amber-400 border-amber-500/40",
  down: "bg-red-500/20 text-red-400 border-red-500/40",
};

const severityStyle: Record<string, string> = {
  critical: "border-red-500/40 text-red-400",
  high: "border-orange-500/40 text-orange-400",
  medium: "border-yellow-500/40 text-yellow-400",
};

/* ================= PAGE ================= */
export default function ResourceAllocationPage() {
  const { emergencies } = useEmergencies();
  const { vehicles, updateVehicle } = useVehicles();
  const { createMission } = useMissions();

  const [selectedEmergency, setSelectedEmergency] =
    useState<Emergency | null>(null);

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [eta, setEta] = useState("");

  /* ---------- FILTERS ---------- */
  const pendingEmergencies = useMemo(
    () => emergencies.filter((e) => e.status === "pending"),
    [emergencies]
  );

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === "available"),
    [vehicles]
  );

  /* ---------- METRICS ---------- */
  const availableCount = vehicles.filter(v => v.status === "available").length;
  const inUseCount = vehicles.filter(v => v.status === "in-use").length;
  const downCount = vehicles.filter(v => v.status === "down").length;

  /* ---------- ACTION ---------- */
  const handleDispatch = async () => {
    if (!selectedEmergency || selectedVehicles.length === 0) return;

    await createMission({
      emergencyId: selectedEmergency._id,
      rescueTeamId: "AUTO_ASSIGN",
      vehiclesAssigned: selectedVehicles,
      eta,
    });

    setSelectedEmergency(null);
    setSelectedVehicles([]);
    setEta("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1e0b3b] to-[#0f172a]">
      <Sidebar role="logistics" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Logistics Resource Allocation
          </h1>
          <p className="text-purple-300">
            Emergency → Mission → Vehicle Dispatch
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard icon={<Truck size={34} />} label="Available" value={availableCount} color="green" />
          <MetricCard icon={<Activity size={34} />} label="In Use" value={inUseCount} color="amber" />
          <MetricCard icon={<Wrench size={34} />} label="Down" value={downCount} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT ================= */}
          <div className="space-y-6">
            {/* EMERGENCIES */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Active Emergencies
              </h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {pendingEmergencies.map((e) => (
                  <div
                    key={e._id}
                    onClick={() => setSelectedEmergency(e)}
                    className={`p-4 rounded-xl cursor-pointer border ${
                      selectedEmergency?._id === e._id
                        ? "bg-purple-500/20 border-purple-400"
                        : "bg-black/40 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">
                        {e.type.toUpperCase()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${severityStyle[e.severity]}`}
                      >
                        {e.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {e.location.lat.toFixed(3)}, {e.location.lng.toFixed(3)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ASSIGN */}
            <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Dispatch Mission
              </h3>

              <label className="text-gray-300 text-sm block mb-2">
                Estimated Arrival Time
              </label>
              <input
                type="datetime-local"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-white/20 text-white mb-4"
              />

              <Button
                onClick={handleDispatch}
                disabled={!selectedEmergency || selectedVehicles.length === 0}
                className="w-full flex gap-2"
              >
                <Send size={18} /> Dispatch Mission
              </Button>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Allocate Vehicles
            </h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10">
                    <TableHead>Select</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {availableVehicles.map((v) => (
                    <TableRow key={v._id} className="hover:bg-purple-500/10">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedVehicles.includes(v._id)}
                          onChange={() =>
                            setSelectedVehicles((prev) =>
                              prev.includes(v._id)
                                ? prev.filter((id) => id !== v._id)
                                : [...prev, v._id]
                            )
                          }
                        />
                      </TableCell>

                      <TableCell className="text-white">
                        {v._id.slice(-5)}
                      </TableCell>
                      <TableCell className="text-white">
                        {v.identifier}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {v.type}
                      </TableCell>

                      <TableCell>
                        <select
                          value={v.status}
                          onChange={(e) =>
                            updateVehicle(v._id, {
                              status: e.target.value as VehicleStatus,
                            })
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[v.status]}`}
                        >
                          <option value="available">Available</option>
                          <option value="in-use">In Use</option>
                          <option value="down">Down</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- METRIC CARD ---------- */
function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "green" | "amber" | "red";
}) {
  const styles = {
    green: "from-emerald-500/20 to-green-600/20 border-emerald-500/40",
    amber: "from-amber-500/20 to-orange-600/20 border-amber-500/40",
    red: "from-red-500/20 to-rose-600/20 border-red-500/40",
  };

  return (
    <div className={`bg-gradient-to-br ${styles[color]} border rounded-2xl p-6`}>
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}
