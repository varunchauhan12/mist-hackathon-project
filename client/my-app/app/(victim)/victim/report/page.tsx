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

const emergencyTypes = [
  { id: "flood", label: "Flood", icon: Droplets, color: "text-blue-500" },
  { id: "fire", label: "Fire", icon: Flame, color: "text-orange-500" },
  {
    id: "trapped",
    label: "Trapped",
    icon: PersonStanding,
    color: "text-yellow-600",
  },
  { id: "medical", label: "Medical", icon: Stethoscope, color: "text-red-500" },
  { id: "other", label: "Other", icon: AlertTriangle, color: "text-gray-500" },
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

  const [step, setstep] = useState(1);
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
      (error) => {
        console.error("Location Error:", error);
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = () => {
    console.log("Submitting Report:", formData);
  };

  const handleNextStep = () => {
    if (step < 3) setstep(step + 1);
  };

  const handleBackStep = () => {
    if (step > 1) setstep(step - 1);
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-4 pb-24">
        {/* {header fil} */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2 ">
            <AlertTriangle className="w-6 h-6" />
            Report Emergency
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Step {step} of 3 - Help is on the way
          </p>
        </div>

        {/* progress bar */}
        <Progress value={(step / 3) * 100} className="mb-6 h-2" />

        {step === 1 && (
          <div className="space-y-4">
            <Link href={"/victim/dashboard"}>
              <Button
                variant={"ghost"}
                onClick={handleBackStep}
                className="ml-auto left-0"
              >
                <ArrowLeft /> Back
              </Button>
            </Link>
            <Card>
              <CardHeader className="flex">
                <CardTitle className="text-lg font-semibold">
                  What type of emergency?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 ">
                  {emergencyTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.emergencyType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            emergencyType: type.id as EmergencyType,
                          }))
                        }
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-red-500 bg-red-50 scale-105 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className={`w-8 h-8 ${type.color}`} />
                        <span className="mt-2 text-sm font-medium text-gray-700">
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={"ghost"}
                  onClick={handleNextStep}
                  className="ml-auto right-0"
                >
                  <ArrowRight /> Next
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Button
              variant={"ghost"}
              onClick={handleBackStep}
              className="ml-auto left-0"
            >
              <ArrowLeft /> Back
            </Button>
            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Your Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.location ? (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-700">
                      📍 Location detected: {formData.location.lat.toFixed(4)},{" "}
                      {formData.location.lng.toFixed(4)}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="w-full"
                    variant="outline"
                  >
                    {isLocating ? "Detecting..." : "📍 Detect My Location"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Describe the situation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="E.g., Water rising fast, stuck on 2nd floor..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">People needing help</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-6">
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
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-4xl font-bold">
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
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button
                variant={"ghost"}
                onClick={handleNextStep}
                className="ml-auto"
              >
                <ArrowRight /> Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Add Photo (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">
                    Tap to upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFormData((prev) => ({
                          ...prev,
                          photos: [
                            ...prev.photos,
                            ...Array.from(e.target.files!),
                          ],
                        }));
                      }
                    }}
                  />
                </label>
                {formData.photos.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.photos.length} photo(s) added
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Urgency Level */}
            <Card>
              <CardHeader className="flex">
                <CardTitle className="text-lg">Urgency Level</CardTitle>
              </CardHeader>

              <CardContent>
                <ToggleGroup
                  type="single"
                  value={formData.urgency}
                  onValueChange={(value) =>
                    value &&
                    setFormData((prev) => ({
                      ...prev,
                      urgency: value as UrgencyLevel,
                    }))
                  }
                  className="grid grid-cols-3 gap-2"
                >
                  <ToggleGroupItem
                    value="critical"
                    className="data-[state=on]:bg-red-500 data-[state=on]:text-white"
                  >
                    🔴 Critical
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="high"
                    className="data-[state=on]:bg-orange-500 data-[state=on]:text-white"
                  >
                    🟠 High
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="medium"
                    className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                  >
                    🟡 Medium
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>

            {/* Summary */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription>
                <strong>Summary:</strong> {formData.emergencyType} emergency,{" "}
                {formData.peopleCount} people, {formData.urgency} urgency
              </AlertDescription>
            </Alert>

            <Button
              variant={"ghost"}
              onClick={handleBackStep}
              className="ml-auto left-0"
            >
              <ArrowLeft /> Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VictimReportPage;
