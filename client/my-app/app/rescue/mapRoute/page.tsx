"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "@/components/Sidebar";
import { Navigation, LocateFixed, Route } from "lucide-react";

/* ---------- Fix Leaflet Icons ---------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ---------- Icons ---------- */
const unitIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const targetIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/* ---------- Follow Unit ---------- */
function FollowUnit({
  position,
  enabled,
}: {
  position: [number, number];
  enabled: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (enabled) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, enabled, map]);

  return null;
}

/* ---------- Fit Route ---------- */
function FitRoute({
  route,
  enabled,
}: {
  route: [number, number][];
  enabled: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!enabled && route.length > 1) {
      map.fitBounds(route, { padding: [80, 80] });
    }
  }, [route, enabled, map]);

  return null;
}

export default function RescueRoutePlanner() {
  const [unitPos, setUnitPos] = useState<[number, number]>([
    28.6139,
    77.209,
  ]);
  const [destination, setDestination] =
    useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [followUnit, setFollowUnit] = useState(false);

  /* ---------- Live GPS ---------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUnitPos([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.warn("GPS error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  /* ---------- Fetch Coordinates ---------- */
  const fetchCoords = async (place: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        place
      )}&format=json&limit=1`
    );
    const data = await res.json();
    if (!data?.length) return null;

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [
      number,
      number
    ];
  };

  /* ---------- Fetch Route ---------- */
  const getRoute = async (dest: [number, number]) => {
    try {
      const apiKey =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJjYjNlYTlkNjIyYjQ0MGJhZjgwODI3MDJhYmU0MmYwIiwiaCI6Im11cm11cjY0In0=";

      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${unitPos[1]},${unitPos[0]}&end=${dest[1]},${dest[0]}`
      );

      const data = await res.json();
      if (!data?.features?.length) throw new Error("No route");

      const coords = data.features[0].geometry.coordinates.map(
        (c: number[]) => [c[1], c[0]]
      );

      setRoute(coords);
      setDestination(dest);

      setInstructions(
        data.features[0].properties.segments[0].steps.map((s: any) => ({
          instruction: s.instruction,
          distance: (s.distance / 1000).toFixed(2),
          duration: Math.round(s.duration / 60),
        }))
      );

      setFollowUnit(false);
    } catch (err) {
      console.error("Route error:", err);
      setRoute([unitPos, dest]);
      setDestination(dest);
      setInstructions([]);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    const coords = await fetchCoords(query);
    if (coords) getRoute(coords);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Rescue Route Planning
          </h1>
          <p className="text-cyan-300">
            Live navigation & response routing
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter incident location…"
            className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-lg"
          >
            <Navigation size={16} /> Generate Route
          </button>
          <button
            onClick={() => setFollowUnit((v) => !v)}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg"
          >
            <LocateFixed size={16} />
            {followUnit ? "Following Unit" : "Follow Unit"}
          </button>
        </div>

        {/* Map + Instructions */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Map */}
          <div className="xl:col-span-3 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <MapContainer center={unitPos} zoom={13} className="w-full h-[70vh]">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={unitPos} icon={unitIcon}>
                <Popup>Rescue Unit</Popup>
              </Marker>

              {destination && (
                <Marker position={destination} icon={targetIcon}>
                  <Popup>Incident Location</Popup>
                </Marker>
              )}

              {route.length > 1 && (
                <Polyline
                  positions={route}
                  pathOptions={{ color: "#06b6d4", weight: 5 }}
                />
              )}

              <FollowUnit position={unitPos} enabled={followUnit} />
              <FitRoute route={route} enabled={followUnit} />
            </MapContainer>
          </div>

          {/* Directions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-[70vh] overflow-y-auto">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Route size={18} /> Route Instructions
            </h3>

            {instructions.length ? (
              instructions.map((step, i) => (
                <div
                  key={i}
                  className="mb-3 p-3 bg-gray-900/70 border border-gray-700 rounded-lg"
                >
                  <p className="text-gray-200 text-sm">
                    {step.instruction}
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">
                    {step.distance} km • {step.duration} min
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                No route generated yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
