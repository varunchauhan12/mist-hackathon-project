"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import EmergencyInstructions from "@/components/Emergency";
import { Truck, Wrench, Activity } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: "availableVehicle" | "inUse" | "maintenanceVehicle";
  driver?: string;
}

export default function VehicleAllocationPage() {
  const [vehicles] = useState<Vehicle[]>([
    { id: "1", name: "Truck A", type: "Truck", status: "availableVehicle" },
    {
      id: "2",
      name: "Van B",
      type: "Van",
      status: "inUse",
      driver: "John Doe",
    },
    {
      id: "3",
      name: "Car C",
      type: "Car",
      status: "maintenanceVehicle",
    },
  ]);

  const getStatusStyle = (status: Vehicle["status"]) => {
    const styles = {
      availableVehicle:
        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
      inUse:
        "bg-amber-500/20 text-amber-400 border border-amber-500/40",
      maintenanceVehicle:
        "bg-red-500/20 text-red-400 border border-red-500/40",
    };
    return styles[status];
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1e0b3b] to-[#0f172a]">
      {/* Sidebar */}
      <Sidebar role="logistics" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Vehicle Allocation Center
          </h1>
          <p className="text-purple-300">
            Real-Time Fleet Availability & Assignment
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={<Truck size={34} />}
            label="Available Vehicles"
            value={vehicles.filter(v => v.status === "availableVehicle").length}
            color="green"
          />
          <MetricCard
            icon={<Activity size={34} />}
            label="Currently In Use"
            value={vehicles.filter(v => v.status === "inUse").length}
            color="amber"
          />
          <MetricCard
            icon={<Wrench size={34} />}
            label="Under Maintenance"
            value={vehicles.filter(v => v.status === "maintenanceVehicle").length}
            color="red"
          />
        </div>

        {/* Emergency Instructions */}
        <div className="mb-8">
          <EmergencyInstructions disasterType="flood" />
        </div>

        {/* Vehicle Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Vehicle Registry
          </h3>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow className="bg-white/10 border-b border-white/20">
                  <TableHead className="text-gray-200 font-semibold">
                    ID
                  </TableHead>
                  <TableHead className="text-gray-200 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-200 font-semibold">
                    Type
                  </TableHead>
                  <TableHead className="text-gray-200 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-200 font-semibold">
                    Driver
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {vehicles.map((v, idx) => (
                  <TableRow
                    key={v.id}
                    className={`
                      ${idx % 2 === 0 ? "bg-white/5" : "bg-white/0"}
                      hover:bg-purple-500/10 transition-colors
                      border-b border-white/10
                    `}
                  >
                    <TableCell className="font-medium text-white">
                      {v.id}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {v.name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {v.type}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          v.status
                        )}`}
                      >
                        {v.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {v.driver || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Metric Card ---------- */
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
    green:
      "from-emerald-500/20 to-green-600/20 border-emerald-500/40 text-emerald-400",
    amber:
      "from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-400",
    red:
      "from-red-500/20 to-rose-600/20 border-red-500/40 text-red-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${styles[color]} border rounded-2xl p-6`}
    >
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}
