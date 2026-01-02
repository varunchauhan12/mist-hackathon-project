"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import HeatMap from "@uiw/react-heat-map";
import {
  Users,
  MapPin,
  AlertTriangle,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Person = { lat: number; lng: number };

type Cluster = {
  id: string;
  people: Person[];
  centroid: { lat: number; lng: number };
  avgRadiusKm: number;
  severity: "critical" | "high" | "medium" | "low";
};

/* ================= HELPERS ================= */
function generatePeople(lat: number, lng: number, count: number): Person[] {
  return Array.from({ length: Math.min(count, 200) }, () => ({
    lat: lat + (Math.random() - 0.5) * 0.01,
    lng: lng + (Math.random() - 0.5) * 0.01,
  }));
}

function euclidean(a: Person, b: Person) {
  return Math.sqrt(
    Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2)
  );
}

function centroid(points: Person[]) {
  const sum = points.reduce(
    (acc, p) => ({
      lat: acc.lat + p.lat,
      lng: acc.lng + p.lng,
    }),
    { lat: 0, lng: 0 }
  );
  return {
    lat: sum.lat / points.length,
    lng: sum.lng / points.length,
  };
}

/* ---------- Improved clustering ---------- */
function clusterPeople(
  people: Person[],
  threshold = 0.0025
): Cluster[] {
  const buckets: Person[][] = [];

  people.forEach((p) => {
    let placed = false;

    for (const bucket of buckets) {
      const c = centroid(bucket);
      if (euclidean(p, c) < threshold) {
        bucket.push(p);
        placed = true;
        break;
      }
    }

    if (!placed) buckets.push([p]);
  });

  return buckets.map((bucket, idx) => {
    const c = centroid(bucket);
    const avgDist =
      bucket.reduce((s, p) => s + euclidean(p, c), 0) /
      bucket.length;

    const radiusKm = avgDist * 111; // lat/lng → km approx
    const size = bucket.length;

    return {
      id: `cluster-${idx}`,
      people: bucket,
      centroid: c,
      avgRadiusKm: radiusKm,
      severity:
        size > 150
          ? "critical"
          : size > 100
          ? "high"
          : size > 50
          ? "medium"
          : "low",
    };
  });
}

/* ================= DATA SOURCE ================= */
const people: Person[] = [
  ...generatePeople(28.6139, 77.209, 160),
  ...generatePeople(28.6419, 77.2207, 200),
  ...generatePeople(28.6189, 77.2155, 120),
  ...generatePeople(28.6089, 77.231, 30),
];

/* ================= PAGE ================= */
export default function CrowdSimulationPage() {
  const router = useRouter();
  const [activeCluster, setActiveCluster] = useState<Cluster | null>(null);

  const clusters = useMemo(() => clusterPeople(people), []);

  const heatmapData = clusters.map((c, i) => ({
    x: i + 1,
    y: 1,
    value: c.people.length,
    cluster: c,
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0f172a]">
      <Sidebar role="rescue" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Live Crowd Clustering
          </h1>
          <p className="text-cyan-300">
            Proximity-based clustering with centroid & radius intelligence
          </p>
        </div>

        {/* Heatmap */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Crowd Density Heatmap
          </h3>

          <div className="flex justify-center">
            <HeatMap
              value={heatmapData}
              width={700}
              height={120}
              rectSize={70}
              space={12}
              rectRender={(props, data) => (
                <rect
                  {...props}
                  rx={14}
                  className="cursor-pointer transition-all hover:opacity-90"
                  onClick={() => setActiveCluster(data.cluster)}
                />
              )}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Stat icon={<AlertTriangle />} label="Critical" value={clusters.filter(c => c.severity === "critical").length} color="red" />
          <Stat icon={<TrendingUp />} label="High" value={clusters.filter(c => c.severity === "high").length} color="orange" />
          <Stat icon={<Users />} label="People" value={people.length} color="yellow" />
          <Stat icon={<MapPin />} label="Clusters" value={clusters.length} color="cyan" />
        </div>
      </main>

      {/* Modal */}
      {activeCluster && (
        <ClusterModal
          cluster={activeCluster}
          onClose={() => setActiveCluster(null)}
          onNavigate={() =>
            router.push(
              `/mapRoute?lat=${activeCluster.centroid.lat}&lng=${activeCluster.centroid.lng}`
            )
          }
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */
function ClusterModal({
  cluster,
  onClose,
  onNavigate,
}: {
  cluster: Cluster;
  onClose: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[420px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-lg">
            Cluster Intelligence
          </h3>
          <X className="text-gray-400 cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-2 text-sm">
          <Info label="People" value={cluster.people.length} />
          <Info
            label="Centroid"
            value={`${cluster.centroid.lat.toFixed(4)}, ${cluster.centroid.lng.toFixed(4)}`}
          />
          <Info
            label="Effective Radius"
            value={`${cluster.avgRadiusKm.toFixed(2)} km`}
          />
          <Info label="Severity" value={cluster.severity.toUpperCase()} />
        </div>

        <button
          onClick={onNavigate}
          className="mt-6 w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 py-2 rounded-lg font-semibold transition-all"
        >
          Open Route Map →
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <p className="text-gray-300">
      <span className="text-gray-500">{label}:</span> {value}
    </p>
  );
}

/* ================= STAT CARD ================= */
function Stat({ icon, label, value, color }: any) {
  const styles: any = {
    red: "bg-red-500/10 border-red-500/30 text-red-400",
    orange: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  };

  return (
    <div className={`border rounded-lg p-3 ${styles[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
