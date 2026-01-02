"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import {
  Users,
  MapPin,
  Navigation,
  MessageCircle,
  Send,
  Circle,
  X,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

/* ------------------ DYNAMIC LEAFLET ------------------ */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

/* ------------------ DATA ------------------ */
interface Team {
  id: string;
  name: string;
  location: string;
  position: [number, number];
  distance: number;
  status: "available" | "on-mission" | "offline";
}

const TEAMS: Team[] = [
  {
    id: "T-01",
    name: "Alpha Team",
    location: "Connaught Place",
    position: [28.6304, 77.2177],
    distance: 2.3,
    status: "available",
  },
  {
    id: "T-02",
    name: "Bravo Team",
    location: "Karol Bagh",
    position: [28.6519, 77.1909],
    distance: 3.8,
    status: "on-mission",
  },
  {
    id: "T-03",
    name: "Charlie Team",
    location: "Nehru Place",
    position: [28.5494, 77.2501],
    distance: 5.2,
    status: "available",
  },
];

export default function TeamCoordination() {
  const [mounted, setMounted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const myPosition: [number, number] = [28.6139, 77.209];

  useEffect(() => {
    setMounted(true);

    (async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    })();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNavigation = () => {
    if (!selectedTeam) return;
    setRoute([myPosition, selectedTeam.position]);
    setShowModal(false);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        own: true,
      },
    ]);
    setMessage("");
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Team Coordination
          </h1>
          <p className="text-cyan-300">
            Live coordination with nearby rescue units
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">
            {/* Teams */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex gap-2">
                <Users className="text-cyan-400" /> Nearby Teams
              </h3>

              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                {TEAMS.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-gray-700/50 to-gray-900/40 border border-gray-600 rounded-xl p-5 cursor-pointer hover:border-cyan-500/60 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {team.name}
                        </p>
                        <p className="text-gray-300 text-sm flex items-center gap-2">
                          <MapPin size={14} />
                          {team.location} • {team.distance} km
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                          team.status === "available"
                            ? "bg-green-500/20 text-green-300 border border-green-500/40"
                            : team.status === "on-mission"
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                            : "bg-gray-500/20 text-gray-300 border border-gray-500/40"
                        }`}
                      >
                        <Circle size={8} className="fill-current" />
                        {team.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MAP */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Team Locations
              </h3>

              <MapContainer
                center={myPosition}
                zoom={12}
                className="h-[280px] rounded-xl"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {TEAMS.map((team) => (
                  <Marker
                    key={team.id}
                    position={team.position}
                    eventHandlers={{
                      click: () => {
                        setSelectedTeam(team);
                        setShowModal(true);
                      },
                    }}
                  >
                    <Popup>
                      <strong>{team.name}</strong>
                      <br />
                      Click to navigate
                    </Popup>
                  </Marker>
                ))}

                {route.length > 1 && (
                  <Polyline
                    positions={route}
                    pathOptions={{ color: "#06b6d4", weight: 4 }}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          {/* CHAT */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <MessageCircle className="text-cyan-400" />
              <div>
                <p className="text-white font-semibold">Team Chat</p>
                <p className="text-xs text-gray-400">
                  {selectedTeam
                    ? `Chatting with ${selectedTeam.name}`
                    : "Select a team to start"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.own ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                      m.own
                        ? "bg-cyan-500 text-slate-900"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className="text-[10px] opacity-70 text-right mt-1">
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="pt-4 border-t border-white/10 flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type message…"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold flex items-center gap-2"
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {showModal && selectedTeam && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#020617] border border-cyan-500/40 rounded-2xl p-6 w-[360px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg">
                  Navigate to Team
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="text-gray-400" />
                </button>
              </div>

              <p className="text-cyan-400 font-semibold">
                {selectedTeam.name}
              </p>
              <p className="text-gray-300 text-sm mb-4">
                {selectedTeam.location} • {selectedTeam.distance} km
              </p>

              <button
                onClick={startNavigation}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold flex items-center justify-center gap-2"
              >
                <Navigation size={18} />
                Start Navigation
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
