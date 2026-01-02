"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import { Navigation, LocateFixed, Route } from "lucide-react";
import "leaflet/dist/leaflet.css";

/* ------------------ DYNAMIC LEAFLET (NO SSR) ------------------ */
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
const useMap = dynamic(
  () => import("react-leaflet").then((m) => m.useMap),
  { ssr: false }
);

/* ------------------ FOLLOW UNIT ------------------ */
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

/* ------------------ FIT ROUTE ------------------ */
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
  const [mounted, setMounted] = useState(false);

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

  /* ------------------ CLIENT-ONLY LEAFLET SETUP ------------------ */
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

  /* ------------------ LIVE GPS ------------------ */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) =>
        setUnitPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("GPS error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  /* ------------------ FETCH COORDINATES ------------------ */
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

  /* ------------------ FETCH ROUTE ------------------ */
  const getRoute = async (dest: [number, number]) => {
    try {
      const apiKey = "YOUR_OPENROUTESERVICE_KEY";

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
    } catch {
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

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-white mb-6">
          Rescue Route Planning
        </h1>

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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 rounded-2xl overflow-hidden">
            <MapContainer center={unitPos} zoom={13} className="h-[70vh]">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={unitPos}>
                <Popup>Rescue Unit</Popup>
              </Marker>

              {destination && (
                <Marker position={destination}>
                  <Popup>Incident Location</Popup>
                </Marker>
              )}

              {route.length > 1 && (
                <Polyline positions={route} pathOptions={{ color: "#06b6d4" }} />
              )}

              <FollowUnit position={unitPos} enabled={followUnit} />
              <FitRoute route={route} enabled={followUnit} />
            </MapContainer>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl h-[70vh] overflow-y-auto">
            <h3 className="text-white font-semibold mb-4 flex gap-2">
              <Route size={18} /> Route Instructions
            </h3>

            {instructions.length ? (
              instructions.map((s, i) => (
                <div key={i} className="mb-3 p-3 bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-200">{s.instruction}</p>
                  <p className="text-xs text-cyan-400">
                    {s.distance} km • {s.duration} min
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No route generated yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
