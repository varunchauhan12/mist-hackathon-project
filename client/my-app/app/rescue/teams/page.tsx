"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import SafeZoneMap from "@/components/Map";
import {
  Users,
  MapPin,
  MessageCircle,
  Send,
  Circle,
  X,
  Navigation,
  Clock,
} from "lucide-react";

/* ------------------ TYPES ------------------ */
interface Team {
  id: string;
  name: string;
  location: string;
  position: [number, number];
  distance: number;
  status: "available" | "on-mission" | "offline";
  members: number;
  lastUpdate: string;
  mission?: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  own: boolean;
}

/* ------------------ MOCK DATA ------------------ */
const MOCK_TEAMS: Team[] = [
  {
    id: "T-001",
    name: "Alpha Team",
    location: "Connaught Place",
    position: [28.6304, 77.2177],
    distance: 2.3,
    status: "available",
    members: 5,
    lastUpdate: "2 min ago",
  },
  {
    id: "T-002",
    name: "Bravo Team",
    location: "Karol Bagh",
    position: [28.6519, 77.1909],
    distance: 3.8,
    status: "on-mission",
    members: 6,
    mission: "Medical Emergency",
    lastUpdate: "5 min ago",
  },
  {
    id: "T-003",
    name: "Charlie Team",
    location: "Nehru Place",
    position: [28.5494, 77.2501],
    distance: 5.2,
    status: "available",
    members: 4,
    lastUpdate: "1 min ago",
  },
  {
    id: "T-004",
    name: "Delta Team",
    location: "Dwarka",
    position: [28.5921, 77.046],
    distance: 8.5,
    status: "on-mission",
    members: 5,
    mission: "Fire Rescue",
    lastUpdate: "10 min ago",
  },
  {
    id: "T-005",
    name: "Echo Team",
    location: "Rohini",
    position: [28.7496, 77.0669],
    distance: 12.1,
    status: "available",
    members: 7,
    lastUpdate: "3 min ago",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "Alpha Team",
    text: "We're approaching the zone. ETA 5 minutes.",
    time: "10:34 AM",
    own: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Copy that. We need backup at Sector 12.",
    time: "10:35 AM",
    own: true,
  },
  {
    id: 3,
    sender: "Bravo Team",
    text: "Currently engaged. Charlie Team can assist.",
    time: "10:36 AM",
    own: false,
  },
];

export default function TeamCoordination() {
  const [mounted, setMounted] = useState(false);
  const [myPosition] = useState<[number, number]>([28.6139, 77.209]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getStatusStyle = (status: Team["status"]) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/40",
          text: "text-green-400",
          dot: "bg-green-400",
        };
      case "on-mission":
        return {
          bg: "bg-orange-500/20",
          border: "border-orange-500/40",
          text: "text-orange-400",
          dot: "bg-orange-400",
        };
      case "offline":
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/40",
          text: "text-gray-400",
          dot: "bg-gray-400",
        };
    }
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const handleStartNavigation = () => {
    if (!selectedTeam) return;
    setShowRoute(true);
    setShowModal(false);
    alert(`Navigation started to ${selectedTeam.name}`);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      own: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!mounted) return null;

  // Convert teams to SafeZone format for map compatibility
  const teamsAsSafeZones = MOCK_TEAMS.map((team) => ({
    id: team.id,
    name: team.name,
    type: "Team",
    position: team.position,
    status: team.status === "available" ? "available" as const : "near-capacity" as const,
    distance: team.distance,
    eta: Math.round(team.distance * 15), // Rough ETA calculation
    occupancy: {
      current: team.members,
      capacity: 10,
      percentage: (team.members / 10) * 100,
    },
    facilities: [],
    safetyRating: 8.5,
    lastVerified: team.lastUpdate,
    address: team.location,
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Team Coordination Hub
          </h1>
          <p className="text-cyan-300">
            Real-time collaboration with nearby rescue teams
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="xl:col-span-2 space-y-6">
            {/* Nearby Teams List */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-cyan-400" />
                Nearby Teams ({MOCK_TEAMS.length})
              </h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {MOCK_TEAMS.map((team) => {
                  const colors = getStatusStyle(team.status);
                  return (
                    <div
                      key={team.id}
                      onClick={() => handleTeamSelect(team)}
                      className={`bg-gradient-to-r from-gray-800/50 to-gray-900/30 border ${colors.border} rounded-xl p-4 hover:border-cyan-500/50 transition-all cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${colors.dot} ${
                              team.status !== "offline" ? "animate-pulse" : ""
                            }`}
                          />
                          <div>
                            <h4 className="text-white font-semibold text-lg">
                              {team.name}
                            </h4>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <MapPin size={14} />
                              {team.location}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTeamSelect(team);
                          }}
                          className="p-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                        >
                          <Navigation size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Distance</p>
                          <p className="text-white font-semibold">
                            {team.distance} km
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Members</p>
                          <p className="text-white font-semibold">
                            {team.members}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status</p>
                          <p
                            className={`${colors.text} font-semibold capitalize text-xs`}
                          >
                            {team.status.replace("-", " ")}
                          </p>
                        </div>
                      </div>

                      {team.mission && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-orange-400 text-sm flex items-center gap-2">
                            <Circle size={8} className="fill-current" />
                            Active Mission: {team.mission}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-gray-500 text-xs flex items-center gap-2">
                          <Clock size={12} />
                          Last update: {team.lastUpdate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-cyan-400" />
                Teams Location Map
              </h3>

              <div className="rounded-xl overflow-hidden border border-white/5">
                <SafeZoneMap
                  userPosition={myPosition}
                  safeZones={teamsAsSafeZones}
                  selectedZone={
                    selectedTeam
                      ? teamsAsSafeZones.find((z) => z.id === selectedTeam.id) || null
                      : null
                  }
                  onZoneClick={(zone) => {
                    const team = MOCK_TEAMS.find((t) => t.id === zone.id);
                    if (team) handleTeamSelect(team);
                  }}
                  showRoute={showRoute}
                  className="h-[400px]"
                />
              </div>

              {selectedTeam && showRoute && (
                <div className="mt-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/40 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-400 text-sm font-semibold mb-1">
                        Navigating to
                      </p>
                      <p className="text-white font-bold text-lg">
                        {selectedTeam.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {selectedTeam.location} • {selectedTeam.distance} km
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRoute(false)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - CHAT */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-[calc(100vh-120px)]">
            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <MessageCircle className="text-cyan-400" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold">Team Chat</p>
                <p className="text-xs text-gray-400">
                  {selectedTeam
                    ? `With ${selectedTeam.name}`
                    : "Select a team to start"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.own ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                      msg.own
                        ? "bg-cyan-500 text-slate-900"
                        : "bg-gray-800 text-white border border-gray-700"
                    }`}
                  >
                    {!msg.own && (
                      <p className="text-xs opacity-70 mb-1 font-semibold">
                        {msg.sender}
                      </p>
                    )}
                    <p>{msg.text}</p>
                    <p className="text-[10px] opacity-70 text-right mt-1">
                      {msg.time}
                                          </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Modal */}
        {showModal && selectedTeam && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Navigate to Team
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="text-gray-400" size={20} />
                </button>
              </div>

              {/* Team Info */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      getStatusStyle(selectedTeam.status).dot
                    } animate-pulse`}
                  />
                  <div>
                    <p className="text-white font-bold text-lg">
                      {selectedTeam.name}
                    </p>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <MapPin size={14} />
                      {selectedTeam.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Distance</p>
                    <p className="text-white font-bold">
                      {selectedTeam.distance} km
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Members</p>
                    <p className="text-white font-bold">
                      {selectedTeam.members}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Status</p>
                    <p
                      className={`${
                        getStatusStyle(selectedTeam.status).text
                      } font-bold capitalize text-xs`}
                    >
                      {selectedTeam.status.replace("-", " ")}
                    </p>
                  </div>
                </div>

                {selectedTeam.mission && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-orange-400 text-sm flex items-center gap-2">
                      <Circle size={8} className="fill-current" />
                      Currently on: {selectedTeam.mission}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartNavigation}
                  className="flex-1 py-3 bg-cyan-500 text-slate-900 rounded-xl font-semibold hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Start Navigation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

