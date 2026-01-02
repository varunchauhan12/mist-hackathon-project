"use client";

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
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ---------- Types ---------- */
type EmergencyType = "flood" | "fire" | "trapped" | "medical" | "other";
type UrgencyLevel = "critical" | "high" | "medium";

interface EmergencyRequest {
  id: string;
  emergencyType: EmergencyType;
  description: string;
  location: { lat: number; lng: number };
  peopleCount: number;
  urgency: UrgencyLevel;

}

/* ---------- Mock Requests ---------- */
const mockRequests: EmergencyRequest[] = [
  {
    id: "REQ-001",
    emergencyType: "flood",
    description: "Water rising fast, stuck on 2nd floor with family",
    location: { lat: 28.6139, lng: 77.209 },
    peopleCount: 4,
    urgency: "critical",
  },
  {
    id: "REQ-002",
    emergencyType: "medical",
    description: "Elderly person needs immediate medical attention",
    location: { lat: 28.6129, lng: 77.2295 },
    peopleCount: 1,
    urgency: "high",
  },
  {
    id: "REQ-003",
    emergencyType: "fire",
    description: "Small fire in kitchen, contained",
    location: { lat: 28.6149, lng: 77.238 },
    peopleCount: 2,
    urgency: "medium",
  },
];

/* ---------- Config ---------- */
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

const urgencyStyle: Record<UrgencyLevel, string> = {
  critical: "bg-red-500/20 text-red-300 border-red-400",
  high: "bg-orange-500/20 text-orange-300 border-orange-400",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-400",
};

/* ---------- Page ---------- */
export default function MyRequestsPage() {
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

        {/* Card List */}
        <div className="space-y-6">
          {mockRequests.map((req) => {
            const emergency = emergencyConfig[req.emergencyType];
            const Icon = emergency.icon;

            return (
              <Card
                key={req.id}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <Icon className={`w-7 h-7 ${emergency.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {emergency.label} Emergency
                        </p>
                        <p className="text-sm text-gray-400">{req.id}</p>
                      </div>
                    </div>

                    <Badge
                      className={`border text-sm px-3 py-1 ${urgencyStyle[req.urgency]}`}
                    >
                      {req.urgency.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 text-lg">
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
                      {req.location.lat.toFixed(4)},{" "}
                      {req.location.lng.toFixed(4)}
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
