import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";

type Role = "victim" | "rescue" | "logistics";

type Location = {
  lat: number;
  lng: number;
};

const getDistanceInMeters = (a: Location, b: Location) => {
  const R = 6371000; 
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
};

export const useLiveLocation = (role: Role) => {
  const watchIdRef = useRef<number | null>(null);
  const lastLocationRef = useRef<Location | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const currentLocation: Location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        // 20 meters threshold
        if (lastLocationRef.current) {
          const distance = getDistanceInMeters(
            lastLocationRef.current,
            currentLocation
          );

          if (distance < 20) return;
        }

        lastLocationRef.current = currentLocation;

        socket.emit("locationUpdate", {
          ...currentLocation,
          role,
        });
      },
      (err) => {
        console.error("Error getting location:", err);
      },
      {
        enableHighAccuracy: role !== "logistics",
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [role]);
};
