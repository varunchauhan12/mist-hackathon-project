import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

class SocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(accessToken: string) {
    if (this.socket?.connected) {
      console.log("✅ Socket already connected");
      return this.socket;
    }

    this.token = accessToken;
    this.reconnectAttempts = 0;

    this.socket = io(SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);

      if (reason === "io server disconnect") {
        // Server forcefully disconnected, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("❌ Max reconnection attempts reached");
        this.disconnect();
      }
    });

    this.socket.on("error", (error) => {
      console.error("🔴 Socket error:", error);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Socket reconnection attempt ${attemptNumber}`);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ Socket reconnection failed");
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("👋 Disconnecting socket");
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit '${event}': Socket not connected`);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  once(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.once(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getId() {
    return this.socket?.id;
  }
}

// Export singleton instance
export const socket = new SocketClient();
export default socket;
