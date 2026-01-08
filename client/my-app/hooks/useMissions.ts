"use client";

import { useState, useEffect } from "react";
import missionApi from "@/lib/api/missionApi";
import { Mission, CreateMissionData, MissionStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export const useMissions = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch missions
  const fetchMissions = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let data: Mission[];

      if (user.role === "rescue") {
        data = await missionApi.getMyMissions();
      } else if (user.role === "logistics") {
        data = await missionApi.getAll();
      } else {
        data = [];
      }

      setMissions(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch missions");
    } finally {
      setLoading(false);
    }
  };

  // Create mission (Logistics only)
  const createMission = async (data: CreateMissionData) => {
    setLoading(true);
    setError(null);

    try {
      const newMission = await missionApi.create(data);
      setMissions((prev) => [newMission, ...prev]);
      return newMission;
    } catch (err: any) {
      setError(err.message || "Failed to create mission");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update mission status
  const updateStatus = async (missionId: string, status: MissionStatus) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await missionApi.updateStatus(missionId, status);
      setMissions((prev) =>
        prev.map((m) => (m._id === missionId ? updated : m))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update mission status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get mission by ID
  const getMissionById = async (missionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const mission = await missionApi.getById(missionId);
      return mission;
    } catch (err: any) {
      setError(err.message || "Failed to fetch mission");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === "rescue" || user.role === "logistics")) {
      fetchMissions();
    }
  }, [user]);

  return {
    missions,
    loading,
    error,
    createMission,
    updateStatus,
    getMissionById,
    refetch: fetchMissions,
  };
};
