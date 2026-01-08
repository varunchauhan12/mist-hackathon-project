import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { addUser, removeUser } from "../utils/socketRegistry.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["polling", "websocket"], 
  });

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        return next(new Error("Auth error: token missing"));
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      socket.userId = decoded.userId || decoded._id || decoded.id;
      socket.role = decoded.role;

      if (!socket.userId) {
        return next(new Error("Auth error: invalid token payload"));
      }

      next();
    } catch (err) {
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    addUser(socket.userId, socket.id);
    socket.join(socket.role);
    
    import("../socket/locationHandler.js").then(({ default: locationHandler }) => {
      locationHandler(io, socket);
    });
    
    import("../socket/rescueChatHandler.js").then(({ default: rescueChatHandler }) => {
      rescueChatHandler(io, socket);
    });

    import("../socket/routeHandler.js").then(({ default: routeHandler }) => {
      routeHandler(io, socket);
    });

    socket.on("disconnect", () => {
      removeUser(socket.userId);
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
};
