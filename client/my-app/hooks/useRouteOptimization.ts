"use client";

import { useState } from "react";
import routeApi from "@/lib/api/routeApi";
import { Location } from "@/types";

export const useRouteOptimization = () => {
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeRoute = async (
    start: Location,
    end: Location,
    context?: any
  ) => {
    setLoading(true);
    setError(null);

    try {
      const optimizedRoute = await routeApi.optimize({ start, end, context });
      setRoute(optimizedRoute);
      return optimizedRoute;
    } catch (err: any) {
      setError(err.message || "Failed to optimize route");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    route,
    loading,
    error,
    optimizeRoute,
  };
};
