"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Activity,
  ChevronDown,
} from "lucide-react";

/* ---------- Types ---------- */
type MissionStatus =
  | "pending"
  | "enroute"
  | "active"
  | "completed"
  | "cancelled";

interface Mission {
  _id: string;
  emergencyId: string;
  rescueTeamId: string;
  vehiclesAssigned: string[];
  status: MissionStatus;
  eta?: string;
  startedAt?: string;
  completedAt?: string;
}

/* ---------- Mock Data ---------- */
const INITIAL_MISSIONS: Mission[] = [
  {
    _id: "M-2011",
    emergencyId: "E-901",
    rescueTeamId: "T-Alpha",
    vehiclesAssigned: ["V-12", "V-18"],
    status: "active",
    eta: "2026-01-06T18:45:00Z",
    startedAt: "2026-01-06T18:10:00Z",
  },
  {
    _id: "M-2012",
    emergencyId: "E-902",
    rescueTeamId: "T-Bravo",
    vehiclesAssigned: ["V-07"],
    status: "enroute",
    eta: "2026-01-06T19:05:00Z",
  },
  {
    _id: "M-2013",
    emergencyId: "E-903",
    rescueTeamId: "T-Charlie",
    vehiclesAssigned: ["V-21", "V-22"],
    status: "pending",
  },
  {
    _id: "M-2014",
    emergencyId: "E-904",
    rescueTeamId: "T-Delta",
    vehiclesAssigned: ["V-03"],
    status: "completed",
    completedAt: "2026-01-06T17:40:00Z",
  },
  {
    _id: "M-2015",
    emergencyId: "E-905",
    rescueTeamId: "T-Echo",
    vehiclesAssigned: [],
    status: "cancelled",
  },
];

/* ---------- Helpers ---------- */
function formatETA(date?: string) {
  if (!date) return "—";
  const mins = Math.max(
    Math.round((new Date(date).getTime() - Date.now()) / 60000),
    0
  );
  return `${mins} min`;
}

const STATUS_ORDER: MissionStatus[] = [
  "pending",
  "enroute",
  "active",
  "completed",
  "cancelled",
];

const statusStyles: Record<MissionStatus, string> = {
  pending: "bg-gray-500/20 text-gray-300 border-gray-500/40",
  enroute: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  active: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  completed: "bg-green-500/20 text-green-400 border-green-500/40",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/40",
};

const statusIcons: Record<MissionStatus, JSX.Element> = {
  pending: <Clock size={14} />,
  enroute: <Truck size={14} />,
  active: <Activity size={14} />,
  completed: <CheckCircle size={14} />,
  cancelled: <XCircle size={14} />,
};

/* ---------- Page ---------- */
export default function LiveMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const sortedMissions = useMemo(() => {
    const priority: Record<MissionStatus, number> = {
      active: 0,
      enroute: 1,
      pending: 2,
      completed: 3,
      cancelled: 4,
    };

    return [...missions].sort(
      (a, b) => priority[a.status] - priority[b.status]
    );
  }, [missions]);

  const updateStatus = (id: string, status: MissionStatus) => {
    setMissions((prev) =>
      prev.map((m) =>
        m._id === id
          ? {
              ...m,
              status,
              startedAt:
                status === "active" && !m.startedAt
                  ? new Date().toISOString()
                  : m.startedAt,
              completedAt:
                status === "completed"
                  ? new Date().toISOString()
                  : m.completedAt,
            }
          : m
      )
    );
    setOpenDropdown(null);

    // 🔌 backend hook
    // await api.patch(`/missions/${id}`, { status })
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Live Missions
          </h1>
          <p className="text-cyan-300">
            Click a status badge to update mission state
          </p>
        </div>

        {/* Mission List */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Mission Queue ({sortedMissions.length})
          </h3>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {sortedMissions.map((m) => {
              const isLocked =
                m.status === "completed" || m.status === "cancelled";

              return (
                <div
                  key={m._id}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-gray-700 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between">
                    {/* Left */}
                    <div>
                      <div className="flex items-center gap-3 mb-2 relative">
                        <span className="text-white font-semibold text-lg">
                          {m._id}
                        </span>

                        {/* Status Badge */}
                        <button
                          disabled={isLocked}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === m._id ? null : m._id
                            )
                          }
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                            statusStyles[m.status]
                          } ${
                            isLocked
                              ? "cursor-not-allowed opacity-70"
                              : "hover:ring-2 hover:ring-cyan-400/40"
                          }`}
                        >
                          {statusIcons[m.status]}
                          {m.status.toUpperCase()}
                          {!isLocked && <ChevronDown size={14} />}
                        </button>

                        {/* Dropdown */}
                        {openDropdown === m._id && !isLocked && (
                          <div className="absolute top-8 left-0 z-50 w-40 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                            {STATUS_ORDER.map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatus(m._id, s)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left text-gray-300 hover:bg-gray-800"
                              >
                                {statusIcons[s]}
                                {s.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm">
                        Emergency: {m.emergencyId} • Team:{" "}
                        {m.rescueTeamId}
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        Vehicles:{" "}
                        {m.vehiclesAssigned.length
                          ? m.vehiclesAssigned.join(", ")
                          : "None"}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-400">
                        {formatETA(m.eta)}
                      </p>
                      <p className="text-gray-500 text-xs">ETA</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
