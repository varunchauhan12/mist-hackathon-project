"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Emergency,
  Vehicle,
} from "@/types";
import { useEmergencies } from "@/hooks/useEmergencies";
import { useVehicles } from "@/hooks/useVehicles";
import { useMissions } from "@/hooks/useMissions";

/* ---------------- HELPERS ---------------- */
const severityStyle: Record<string, string> = {
  critical: "border-red-500/50 text-red-400",
  high: "border-orange-500/50 text-orange-400",
  medium: "border-yellow-500/50 text-yellow-400",
};

export default function ResourceAllocationPage() {
  const { emergencies } = useEmergencies();
  const { vehicles } = useVehicles();
  const { createMission } = useMissions();

  const [selectedEmergency, setSelectedEmergency] =
    useState<Emergency | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [eta, setEta] = useState("");

  /* ---------------- DERIVED DATA ---------------- */
  const activeEmergencies = useMemo(
    () => emergencies.filter((e) => e.status === "pending"),
    [emergencies]
  );

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === "available"),
    [vehicles]
  );

  const vehiclesByType = (type: Vehicle["type"]) =>
    availableVehicles.filter((v) => v.type === type);

  /* ---------------- ACTION ---------------- */
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
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="logistics" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Logistics Command Center
          </h1>
          <p className="text-cyan-300">
            Emergency → Mission → Resource Allocation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-6">
            {/* ACTIVE EMERGENCIES */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Active Emergencies ({activeEmergencies.length})
              </h3>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {activeEmergencies.map((e) => (
                  <div
                    key={e._id}
                    onClick={() => setSelectedEmergency(e)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      selectedEmergency?._id === e._id
                        ? "bg-cyan-500/20 border-cyan-400"
                        : "bg-black/40 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-bold">
                        {e.type.toUpperCase()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          severityStyle[e.severity]
                        }`}
                      >
                        {e.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {e.location.lat.toFixed(3)}, {e.location.lng.toFixed(3)}
                    </p>
                  </div>
                ))}

                {activeEmergencies.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No pending emergencies
                  </p>
                )}
              </div>
            </div>

            {/* ASSIGN MISSION */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Assign Mission
              </h3>

              <label className="text-gray-300 text-sm block mb-2">
                Estimated Arrival Time
              </label>
              <input
                type="datetime-local"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white mb-4"
              />

              <button
                onClick={handleDispatch}
                disabled={!selectedEmergency || selectedVehicles.length === 0}
                className="w-full py-3 bg-cyan-500 text-slate-900 rounded-xl font-bold disabled:opacity-40"
              >
                Dispatch Mission
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* VEHICLE SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["ambulance", "boat", "helicopter", "truck"] as Vehicle["type"][])
                .map((type) => {
                  const available = vehiclesByType(type).length;
                  const total = vehicles.filter((v) => v.type === type).length;

                  return (
                    <div
                      key={type}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <p className="text-gray-400 text-sm uppercase">
                        {type}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {available}/{total}
                      </p>
                      <div className="h-2 bg-slate-700 rounded mt-2">
                        <div
                          className="h-2 bg-cyan-400 rounded"
                          style={{
                            width:
                              total === 0
                                ? "0%"
                                : `${(available / total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* VEHICLE ALLOCATION */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Allocate Vehicles ({availableVehicles.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {availableVehicles.map((v) => (
                  <div
                    key={v._id}
                    onClick={() =>
                      setSelectedVehicles((prev) =>
                        prev.includes(v._id)
                          ? prev.filter((id) => id !== v._id)
                          : [...prev, v._id]
                      )
                    }
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      selectedVehicles.includes(v._id)
                        ? "bg-cyan-500/20 border-cyan-400"
                        : "bg-black/40 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-white font-semibold">
                      {v.type.toUpperCase()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      ID: {v.identifier}
                    </p>
                  </div>
                ))}

                {availableVehicles.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No vehicles available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
