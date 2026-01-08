import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { addUser, removeUser } from "../utils/socketRegistry.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  /* 🔐 COOKIE-BASED SOCKET AUTH */
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        return next(new Error("Authentication error: Token not provided"));
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      socket.userId = decoded.id;
      socket.role = decoded.role;

      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    addUser(socket.userId, socket.id);
    socket.join(socket.role);

    require("../socket/locationHandler.js")(io, socket);
    require("../socket/rescueChatHandler.js")(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      removeUser(socket.userId);
    });
  });

  return io;
};
