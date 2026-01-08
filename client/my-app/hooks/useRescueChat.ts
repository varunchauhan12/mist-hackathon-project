"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export type RescueMessage = {
  senderId: string;
  message: string;
  timestamp: string | Date;
};

export const useRescueChat = (lat: number | null, lng: number | null) => {
  const [messages, setMessages] = useState<RescueMessage[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (lat == null || lng == null) return;

    socket.emit("rescue:join-nearby", { lat, lng });

    const handleJoined = ({ roomId }: { roomId: string }) => {
      setRoomId(roomId);
      setMessages([]); // ✅ reset chat when room changes
    };

    const handleMessage = (msg: RescueMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("rescue:joined-room", handleJoined);
    socket.on("rescue:new-message", handleMessage);

    return () => {
      socket.off("rescue:joined-room", handleJoined);
      socket.off("rescue:new-message", handleMessage);
    };
  }, [lat, lng]);

  const sendMessage = (message: string) => {
    if (!message.trim() || !roomId) return;
    socket.emit("rescue:send-message", { message });
  };

  return { messages, roomId, sendMessage };
};
