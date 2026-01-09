import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { addUser, removeUser } from "../utils/socketRegistry.js";

// socket handlers
import locationHandler from "../socket/locationHandler.js";
import rescueChatHandler from "../socket/rescueChatHandler.js";
import routeHandler from "../socket/routeHandler.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  /* ================= AUTH MIDDLEWARE ================= */

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        return next(new Error("Auth error: token missing"));
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      const userId = decoded.userId || decoded._id || decoded.id;
      const role = decoded.role;

      if (!userId || !role) {
        return next(new Error("Auth error: invalid token payload"));
      }

      socket.userId = userId;
      socket.role = role;

      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  /* ================= CONNECTION ================= */

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // registry
    addUser(socket.userId, socket.id);

    // REQUIRED rooms
    socket.join(socket.userId.toString()); // direct / route updates
    socket.join(socket.role);              // role broadcasts

    // handlers
    locationHandler(io, socket);
    rescueChatHandler(io, socket);
    routeHandler(io, socket);

    socket.on("disconnect", () => {
      removeUser(socket.userId);
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
};
