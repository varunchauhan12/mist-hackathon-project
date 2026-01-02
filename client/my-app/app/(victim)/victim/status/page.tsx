"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Flame,
  Droplets,
  PersonStanding,
  Stethoscope,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  RefreshCw,
  Plus,
  ArrowLeft,
  Phone,
  Users,
} from "lucide-react";

// Types
type EmergencyType = "flood" | "fire" | "trapped" | "medical" | "other";
type UrgencyLevel = "critical" | "high" | "medium";
type RequestStatus =
  | "submitted"
  | "verified"
  | "dispatched"
  | "enroute"
  | "arrived"
  | "resolved";

interface EmergencyRequest {
  id: string;
  emergencyType: EmergencyType;
  description: string;
  location: { lat: number; lng: number };
  peopleCount: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedTeam?: string;
  estimatedArrival?: string;
}

// Mock data - Replace with API call later
const mockRequests: EmergencyRequest[] = [
  {
    id: "REQ-001",
    emergencyType: "flood",
    description: "Water rising fast, stuck on 2nd floor with family",
    location: { lat: 28.6139, lng: 77.209 },
    peopleCount: 4,
    urgency: "critical",
    status: "enroute",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    assignedTeam: "NDRF Unit 7",
    estimatedArrival: "10 mins",
  },
  {
    id: "REQ-002",
    emergencyType: "medical",
    description: "Elderly person needs immediate medical attention",
    location: { lat: 28.6129, lng: 77.2295 },
    peopleCount: 1,
    urgency: "high",
    status: "dispatched",
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    assignedTeam: "Medical Response Team 3",
    estimatedArrival: "20 mins",
  },
  {
    id: "REQ-003",
    emergencyType: "fire",
    description: "Small fire in kitchen, contained but need help",
    location: { lat: 28.6149, lng: 77.238 },
    peopleCount: 2,
    urgency: "medium",
    status: "resolved",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    assignedTeam: "Fire Brigade Unit 12",
  },
];

// Status configuration
const statusConfig: Record<
  RequestStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  submitted: {
    label: "Submitted",
    color: "bg-gray-500",
    icon: <Clock className="w-3 h-3" />,
  },
  verified: {
    label: "Verified",
    color: "bg-blue-500",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  dispatched: {
    label: "Help Dispatched",
    color: "bg-purple-500",
    icon: <Truck className="w-3 h-3" />,
  },
  enroute: {
    label: "En Route",
    color: "bg-orange-500",
    icon: <MapPin className="w-3 h-3" />,
  },
  arrived: {
    label: "Help Arrived",
    color: "bg-green-500",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-600",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

// Emergency type config
const emergencyConfig: Record<
  EmergencyType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  flood: { label: "Flood", icon: Droplets, color: "text-blue-500" },
  fire: { label: "Fire", icon: Flame, color: "text-orange-500" },
  trapped: { label: "Trapped", icon: PersonStanding, color: "text-yellow-600" },
  medical: { label: "Medical", icon: Stethoscope, color: "text-red-500" },
  other: { label: "Other", icon: AlertTriangle, color: "text-gray-500" },
};

// Urgency config
const urgencyConfig: Record<UrgencyLevel, { label: string; color: string }> = {
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-700 border-red-300",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-700 border-orange-300",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
};

// Status Timeline Component
const StatusTimeline = ({
  currentStatus,
}: {
  currentStatus: RequestStatus;
}) => {
  const stages: RequestStatus[] = [
    "submitted",
    "verified",
    "dispatched",
    "enroute",
    "arrived",
    "resolved",
  ];
  const currentIndex = stages.indexOf(currentStatus);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={stage} className="flex flex-col items-center flex-1">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "bg-white border-gray-300"
                } ${isCurrent ? "ring-2 ring-green-300 ring-offset-1" : ""}`}
              >
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`h-0.5 w-full mt-2 ${
                    index < currentIndex ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Submitted</span>
        <span>Verified</span>
        <span>Dispatched</span>
        <span>En Route</span>
        <span>Arrived</span>
        <span>Resolved</span>
      </div>
    </div>
  );
};

// Request Card Component
const RequestCard = ({ request }: { request: EmergencyRequest }) => {
  const emergency = emergencyConfig[request.emergencyType];
  const status = statusConfig[request.status];
  const urgency = urgencyConfig[request.urgency];
  const Icon = emergency.icon;
  const isActive = request.status !== "resolved";

  const timeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${Math.floor(hours / 24)} day${hours > 24 ? "s" : ""} ago`;
  };

  return (
    <Card
      className={`mb-4 overflow-hidden ${
        isActive
          ? "border-l-4 border-l-red-500"
          : "border-l-4 border-l-green-500"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gray-100`}>
              <Icon className={`w-5 h-5 ${emergency.color}`} />
            </div>
            <div>
              <CardTitle className="text-base">
                {emergency.label} Emergency
              </CardTitle>
              <CardDescription className="text-xs">
                {request.id} • {timeAgo(request.createdAt)}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${urgency.color} border`}>{urgency.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            className={`${status.color} text-white flex items-center gap-1`}
          >
            {status.icon}
            {status.label}
          </Badge>
          {request.estimatedArrival && isActive && (
            <span className="text-sm text-gray-600">
              ETA: <strong>{request.estimatedArrival}</strong>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3">{request.description}</p>

        {/* People Count */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <Users className="w-4 h-4" />
          <span>{request.peopleCount} people</span>
        </div>

        {/* Assigned Team */}
        {request.assignedTeam && (
          <Alert className="bg-blue-50 border-blue-200 py-2">
            <AlertDescription className="text-sm flex items-center justify-between">
              <span>
                🚑 <strong>{request.assignedTeam}</strong> assigned
              </span>
              {isActive && (
                <Button size="sm" variant="ghost" className="h-7 text-blue-600">
                  <Phone className="w-3 h-3 mr-1" /> Call
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Status Timeline */}
        <StatusTimeline currentStatus={request.status} />
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ type }: { type: "active" | "past" }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      {type === "active" ? (
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      ) : (
        <Clock className="w-8 h-8 text-gray-400" />
      )}
    </div>
    <h3 className="font-medium text-gray-700 mb-1">
      {type === "active" ? "No Active Requests" : "No Past Requests"}
    </h3>
    <p className="text-sm text-gray-500">
      {type === "active"
        ? "You don't have any ongoing emergency requests"
        : "Your resolved requests will appear here"}
    </p>
  </div>
);

// Main Page Component
const StatusPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeRequests = mockRequests.filter((r) => r.status !== "resolved");
  const pastRequests = mockRequests.filter((r) => r.status === "resolved");

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/victim">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
          <h1 className="text-xl font-bold text-gray-800">📋 My Requests</h1>
          <p className="text-sm text-gray-500">Track your emergency reports</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active" className="flex items-center gap-1">
              🔴 Active
              {activeRequests.length > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs px-1.5">
                  {activeRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-1">
              ✅ Past
              {pastRequests.length > 0 && (
                <Badge className="ml-1 bg-gray-400 text-white text-xs px-1.5">
                  {pastRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeRequests.length > 0 ? (
              activeRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <EmptyState type="active" />
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastRequests.length > 0 ? (
              pastRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <EmptyState type="past" />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Link href="/victim/report">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
};

export default StatusPage;
