"use client";

import { useState } from "react";
import { AlertCircle, MapPin, Users, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

/* ---------- Mock Data ---------- */
const safeZones = [
  { name: "Community Center", distance: "0.8 km", capacity: 85 },
  { name: "School Stadium", distance: "1.2 km", capacity: 60 },
  { name: "Hospital", distance: "2.1 km", capacity: 45 },
];

const helpMetrics = [
  { category: "Response Time", value: 85 },
  { category: "Safety", value: 90 },
  { category: "Communication", value: 75 },
  { category: "Resources", value: 70 },
  { category: "Coordination", value: 80 },
];

const myRequests = [
  { date: "Jan 20", requests: 1 },
  { date: "Jan 22", requests: 2 },
  { date: "Jan 25", requests: 0 },
  { date: "Jan 28", requests: 1 },
];

export default function VictimDashboard() {
  const [userName] = useState("Rahul Kumar");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      {/* ---------- Sidebar ---------- */}
      <Sidebar role="victim" />

      {/* ---------- Main Content ---------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {userName}
          </h1>
          <p className="text-gray-400">Your safety is our priority</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<AlertCircle size={32} />}
            value="3"
            label="Active Requests"
            color="blue"
          />
          <StatCard
            icon={<MapPin size={32} />}
            value="2"
            label="Nearby Safe Zones"
            color="green"
          />
          <StatCard
            icon={<Users size={32} />}
            value="12"
            label="People Helped"
            color="purple"
          />
          <StatCard
            icon={<Clock size={32} />}
            value="8m"
            label="Avg. Response Time"
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Request History */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Your Request History
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={myRequests}>
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="requests"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Help System Performance */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Help System Performance
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={helpMetrics}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
                <PolarRadiusAxis stroke="#9ca3af" />
                <Radar
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safe Zones */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Nearby Safe Zones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeZones.map((zone, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700 rounded-xl p-5 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <h4 className="text-white font-semibold mb-2">
                  {zone.name}
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {zone.distance} away
                  </span>
                  <span className="text-green-400">
                    {zone.capacity}% capacity
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-gray-300">
                You are a vital sensor in this system. Your reports help save
                lives.
              </p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105">
              Report Emergency
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Reusable Stat Card ---------- */
function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    green:
      "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    purple:
      "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    orange:
      "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-6`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={colors[color].split(" ").pop()}>{icon}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}
