"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Droplets,
  Flame,
  MapPin,
  Minus,
  PersonStanding,
  Plus,
  Stethoscope,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";

/* ---------- Types ---------- */
type EmergencyType = "flood" | "fire" | "trapped" | "medical" | "other";
type UrgencyLevel = "critical" | "high" | "medium";

interface ReportFormData {
  emergencyType: EmergencyType | null;
  description: string;
  location: { lat: number; lng: number } | null;
  peopleCount: number;
  urgency: UrgencyLevel;
  photos: File[];
}

/* ---------- Emergency Types ---------- */
const emergencyTypes = [
  { id: "flood", label: "Flood", icon: Droplets, color: "text-blue-400" },
  { id: "fire", label: "Fire", icon: Flame, color: "text-orange-400" },
  {
    id: "trapped",
    label: "Trapped",
    icon: PersonStanding,
    color: "text-yellow-400",
  },
  { id: "medical", label: "Medical", icon: Stethoscope, color: "text-red-400" },
  { id: "other", label: "Other", icon: AlertTriangle, color: "text-gray-300" },
];

const VictimReportPage = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    emergencyType: null,
    description: "",
    location: null,
    peopleCount: 1,
    urgency: "high",
    photos: [],
  });

  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);

  const detectLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Sidebar role="victim" />

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-400 flex items-center justify-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            Report Emergency
          </h1>
          <p className="text-gray-300 text-lg mt-2">Step {step} of 3</p>
        </div>

        <Progress value={(step / 3) * 100} className="mb-10 h-3 bg-white/20" />

        {/* ---------------- STEP 1 ---------------- */}
        {step === 1 && (
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Select Emergency Type
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {emergencyTypes.map((type) => {
                  const Icon = type.icon;
                  const active = formData.emergencyType === type.id;

                  return (
                    <button
                      key={type.id}
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          emergencyType: type.id as EmergencyType,
                        }))
                      }
                      className={`p-6 rounded-2xl border transition-all
                        ${
                          active
                            ? "border-red-500 bg-red-500/20 scale-105"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                    >
                      <Icon className={`w-10 h-10 mx-auto ${type.color}`} />
                      <p className="mt-3 text-lg font-semibold text-white">
                        {type.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href="/victim/dashboard">
                <Button className="text-gray-300" variant="ghost">
                  <ArrowLeft /> Back
                </Button>
              </Link>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-8 text-lg"
                onClick={() => setStep(2)}
              >
                Next <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {step === 2 && (
          <div className="space-y-8">
            <Button
              variant="ghost"
              className="text-gray-300"
              onClick={() => setStep(1)}
            >
              <ArrowLeft /> Back
            </Button>

            {/* Location */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <MapPin /> Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.location ? (
                  <Alert className="bg-green-500/20 border-green-400">
                    <AlertDescription className="text-green-200 text-lg">
                      Latitude: {formData.location.lat.toFixed(4)} | Longitude:{" "}
                      {formData.location.lng.toFixed(4)}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6"
                  >
                    {isLocating
                      ? "Detecting Location..."
                      : "Detect My Location"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Situation Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  className="text-white text-lg placeholder:text-gray-400"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  People Needing Help
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center gap-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      peopleCount: Math.max(1, prev.peopleCount - 1),
                    }))
                  }
                >
                  <Minus />
                </Button>

                <span className="text-5xl font-bold text-white">
                  {formData.peopleCount}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      peopleCount: prev.peopleCount + 1,
                    }))
                  }
                >
                  <Plus />
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-8 text-lg"
                onClick={() => setStep(3)}
              >
                Next <ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {step === 3 && (
          <div className="space-y-8">
            <Button
              variant="ghost"
              className="text-gray-300"
              onClick={() => setStep(2)}
            >
              <ArrowLeft /> Back
            </Button>

            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Camera /> Upload Photo (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="h-36 flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/10">
                  <Camera className="w-10 h-10 text-gray-300" />
                  <input type="file" className="hidden" />
                </label>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Urgency Level
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ToggleGroup
                  type="single"
                  value={formData.urgency}
                  onValueChange={(value) => {
                    if (!value) return;
                    setFormData((prev) => ({
                      ...prev,
                      urgency: value as UrgencyLevel,
                    }));
                  }}
                  className="grid grid-cols-3 gap-4"
                >
                  <ToggleGroupItem
                    value="critical"
                    className="text-lg data-[state=on]:bg-red-500 data-[state=on]:text-white"
                  >
                    Critical
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="high"
                    className="text-lg data-[state=on]:bg-orange-500 data-[state=on]:text-white"
                  >
                    High
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="medium"
                    className="text-lg data-[state=on]:bg-yellow-500 data-[state=on]:text-black"
                  >
                    Medium
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>

            <Alert className="bg-blue-500/20 border-blue-400">
              <AlertDescription className="text-blue-200 text-lg">
                Summary: {formData.emergencyType} | {formData.peopleCount}{" "}
                people | {formData.urgency} urgency
              </AlertDescription>
            </Alert>
          </div>
        )}
      </main>
    </div>
  );
};

export default VictimReportPage;
