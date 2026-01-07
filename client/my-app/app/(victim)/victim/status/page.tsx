"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Droplets,
  Flame,
  PersonStanding,
  Stethoscope,
  MapPin,
  Users,
  ArrowLeft,
  Loader2,
  Clock,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import api from "@/app/(api)/authApi/page";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

type EmergencyType = "flood" | "fire" | "trapped" | "medical" | "other";
type StatusType = "pending" | "assigned" | "in-progress" | "resolved" | "rejected";

interface EmergencyRequest {
  _id: string;
  type: EmergencyType;
  description: string;
  location: { lat: number; lng: number };
  peopleCount: number;
  severity: "critical" | "high" | "medium" | "low";
  status: StatusType;
  assignedTo?: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const emergencyConfig: Record<
  EmergencyType,
  { label: string; icon: any; color: string }
> = {
  flood: { label: "Flood", icon: Droplets, color: "text-blue-400" },
  fire: { label: "Fire", icon: Flame, color: "text-orange-400" },
  trapped: { label: "Trapped", icon: PersonStanding, color: "text-yellow-400" },
  medical: { label: "Medical", icon: Stethoscope, color: "text-red-400" },
  other: { label: "Other", icon: AlertTriangle, color: "text-gray-300" },
};

const severityStyle: Record<string, string> = {
  critical: "bg-red-500/20 text-red-300 border-red-400",
  high: "bg-orange-500/20 text-orange-300 border-orange-400",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-400",
  low: "bg-green-500/20 text-green-300 border-green-400",
};

const statusStyle: Record<StatusType, string> = {
  pending: "bg-gray-500/20 text-gray-300 border-gray-400",
  assigned: "bg-blue-500/20 text-blue-300 border-blue-400",
  "in-progress": "bg-cyan-500/20 text-cyan-300 border-cyan-400",
  resolved: "bg-green-500/20 text-green-300 border-green-400",
  rejected: "bg-red-500/20 text-red-300 border-red-400",
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.MY_EMERGENCIES);
      setRequests(response.data.data || response.data.emergencies || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <Sidebar role="victim" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Sidebar role="victim" />

      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/victim/dashboard"
            className="text-gray-300 flex items-center gap-2 mb-4 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            My Emergency Requests
          </h1>
          <p className="text-gray-400 mt-1 text-lg">
            Real-time status of your reported emergencies
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && !error && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No Emergency Reports</h3>
            <p className="text-gray-400 mb-6">You haven't reported any emergencies yet.</p>
            <Link
              href="/victim/report"
              className="inline-block px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
            >
              Report Emergency
            </Link>
          </div>
        )}

        {/* Requests List */}
        <div className="space-y-6">
          {requests.map((req) => {
            const emergency = emergencyConfig[req.type];
            const Icon = emergency.icon;

            return (
              <div
                key={req._id}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <Icon className={`w-7 h-7 ${emergency.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {emergency.label} Emergency
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDate(req.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`border text-sm px-3 py-1 rounded-full font-semibold ${
                          severityStyle[req.severity]
                        }`}
                      >
                        {req.severity.toUpperCase()}
                      </span>
                      <span
                        className={`border text-sm px-3 py-1 rounded-full font-semibold ${
                          statusStyle[req.status]
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 text-lg">
                    {/* Description */}
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-gray-400 font-medium">Situation</span>
                      <span className="col-span-2 text-white font-semibold">
                        {req.description}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-gray-400 font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Location
                      </span>
                      <span className="col-span-2 text-white font-mono">
                        {req.location.lat.toFixed(4)}, {req.location.lng.toFixed(4)}
                      </span>
                    </div>

                    {/* People */}
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-gray-400 font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" /> People
                      </span>
                      <span className="col-span-2 text-white font-bold">
                        {req.peopleCount}
                      </span>
                    </div>

                    {/* Assigned Team */}
                    {req.assignedTo && (
                      <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400 font-medium">Assigned To</span>
                        <span className="col-span-2 text-cyan-400 font-bold">
                          {req.assignedTo.fullName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Banner */}
                {req.status === "pending" && (
                  <div className="bg-yellow-500/20 border-t border-yellow-500/40 px-6 py-3">
                    <p className="text-yellow-300 text-sm">
                      ⏳ Your request is being processed. Help is on the way!
                    </p>
                  </div>
                )}
                {req.status === "assigned" && (
                  <div className="bg-blue-500/20 border-t border-blue-500/40 px-6 py-3">
                    <p className="text-blue-300 text-sm">
                      🚑 Rescue team has been assigned and is preparing to respond.
                    </p>
                  </div>
                )}
                {req.status === "in-progress" && (
                  <div className="bg-cyan-500/20 border-t border-cyan-500/40 px-6 py-3">
                    <p className="text-cyan-300 text-sm">
                      🏃 Rescue team is on the way to your location!
                    </p>
                  </div>
                )}
                {req.status === "resolved" && (
                  <div className="bg-green-500/20 border-t border-green-500/40 px-6 py-3">
                    <p className="text-green-300 text-sm">
                      ✅ Emergency resolved successfully. Stay safe!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}