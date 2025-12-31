"use client";

import { useRouter } from "next/navigation";

type Role = "victim" | "rescue" | "logistics";

export default function Sidebar({ role }: { role: Role }) {
  const router = useRouter();

  const linksByRole: Record<Role, { name: string; path: string }[]> = {
    victim: [
      { name: "Report Emergency", path: "/victim/report" },
      { name: "My Requests", path: "/victim/status" },
      { name: "Safe Zones", path: "/victim/safe-zones" },
    ],
    rescue: [
      { name: "Live Missions", path: "/rescue/dashboard" },
      { name: "Heatmap View", path: "/rescue/heatmap" },
      { name: "Team Coordination", path: "/rescue/teams" },
    ],
    logistics: [
      { name: "Control Center", path: "/logistics/dashboard" },
      { name: "Vehicle Allocation", path: "/logistics/vehicles" },
      { name: "What-If Simulator", path: "/logistics/simulator" },
    ],
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0b0f14]/95 border-r border-white/10 p-6 flex flex-col">
      <h2 className="text-2xl font-extrabold text-[#e5e7eb] mb-8">
        COMMANDR
      </h2>

      <nav className="space-y-2">
        {linksByRole[role].map((link) => (
          <button
            key={link.name}
            onClick={() => router.push(link.path)}
            className="w-full text-left px-4 py-3 rounded-xl text-[#9ca3af]
                       hover:text-white hover:bg-white/10 transition"
          >
            {link.name}
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto px-4 py-3 rounded-xl text-[#ef4444]
                   hover:bg-[#ef4444]/10 transition text-left"
      >
        Logout
      </button>

      <p className="mt-6 text-xs text-[#9ca3af]/60">
        © 2026 COMMANDR Platform
      </p>
    </aside>
  );
}
