import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";

type Role = "victim" | "rescue" | "logistics";

export const useLiveLocation = (role: Role) => {
  const watchIdRef = useRef<number | null>(null);
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      // threshold= 11m approx
      if (lastLocationRef.current) {
        const dLat = Math.abs(lastLocationRef.current.lat - latitude);
        const dLng = Math.abs(lastLocationRef.current.lng - longitude);
        if (dLat < 0.0001 && dLng < 0.0001) return;
      }

      lastLocationRef.current = { lat: latitude, lng: longitude };

      socket.emit("locationUpdate", { lat: latitude, lng: longitude, role });
    }, (err) => {
        console.error("Error getting location:", err);
    }, {
        enableHighAccuracy:role!=='logistics',
        maximumAge:10000,
        timeout:5000,
    });

    return () =>{
        if(watchIdRef.current !== null){
            navigator.geolocation.clearWatch(watchIdRef.current);
        }
    }
  },[role]);
};
