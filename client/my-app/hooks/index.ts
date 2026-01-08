// Central hook exports
export { useEmergencies } from "./useEmergencies";
export { useMissions } from "./useMissions";
export { useVehicles } from "./useVehicles";
export { useSafeZones } from "./useSafeZones";
export { useNotifications } from "./useNotifications";
export { useRouteOptimization } from "./useRouteOptimization";
export { useLiveLocation } from "./useLiveLocation";
export { useRescueChat } from "./useRescueChat";

// Re-export auth and socket hooks from contexts
export { useAuth } from "@/contexts/AuthContext";
export { useSocket } from "@/contexts/SocketContext";
