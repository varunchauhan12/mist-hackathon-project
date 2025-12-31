"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Role = "victim" | "rescue" | "logistics";

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
      <p className="text-[#9ca3af] text-sm">{title}</p>
      <p className="text-2xl font-bold text-[#e5e7eb] mt-1">{value}</p>
    </div>
  );
}

/* ------------------ MOCK DATA (API LATER) ------------------ */

const incidentTrend = [
  { time: "08:00", count: 12 },
  { time: "10:00", count: 18 },
  { time: "12:00", count: 27 },
  { time: "14:00", count: 21 },
  { time: "16:00", count: 30 },
];

const statusSplit = [
  { name: "Active", value: 22 },
  { name: "Resolved", value: 14 },
];

const COLORS = ["#ef4444", "#22c55e"];

/* ------------------ DASHBOARD ------------------ */

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [role, setRole] = useState<Role>("victim");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUserName(res.data.user.fullName);
        setRole(res.data.user.role);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] text-[#e5e7eb]">
        Loading COMMANDR Dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f14]">
      <Sidebar role={role} />

      <main className="flex-1 p-8 space-y-10">
        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-[#e5e7eb]"
        >
          Welcome, {userName}
        </motion.h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {role === "victim" && (
            <>
              <SummaryCard title="Help Requests Sent" value="3" />
              <SummaryCard title="Nearby Safe Zones" value="2" />
              <SummaryCard title="Current Status" value="Awaiting Response" />
            </>
          )}

          {role === "rescue" && (
            <>
              <SummaryCard title="Active Missions" value="5" />
              <SummaryCard title="High Risk Alerts" value="7" />
              <SummaryCard title="Average ETA" value="11 min" />
            </>
          )}

          {role === "logistics" && (
            <>
              <SummaryCard title="Vehicles Deployed" value="18" />
              <SummaryCard title="Resource Utilization" value="81%" />
              <SummaryCard title="Failure Simulations" value="4 Ready" />
            </>
          )}
        </div>

        {/* MAP + CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* MAP PANEL */}
          <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 text-[#e5e7eb] font-semibold">
              🌍 Live Disaster Map
            </div>

            {/* MAP PLACEHOLDER (Mapbox ready) */}
            <div className="h-[420px] bg-gradient-to-br from-[#111827] to-[#020617] flex items-center justify-center text-[#9ca3af]">
              Mapbox / Google Maps integration here  
              <br />
              (Heatmap • Live Users • Routes)
            </div>
          </div>

          {/* STATUS PIE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-[#e5e7eb] font-semibold mb-4">
              Incident Status
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusSplit}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {statusSplit.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INCIDENT TREND */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-[#e5e7eb] font-semibold mb-4">
            📈 Incident Frequency Trend
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={incidentTrend}>
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ROLE INTELLIGENCE PANEL */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {role === "victim" && (
            <p className="text-[#9ca3af]">
              You are a live sensor in the system. Your reports directly improve
              rescue prioritization and response accuracy.
            </p>
          )}

          {role === "rescue" && (
            <p className="text-[#9ca3af]">
              This dashboard helps you minimize response time, avoid duplicate
              rescues, and coordinate efficiently with nearby units.
            </p>
          )}

          {role === "logistics" && (
            <p className="text-[#9ca3af]">
              Use system-wide visibility to optimize vehicles, simulate failures,
              and prepare strategic responses for upcoming disaster waves.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
