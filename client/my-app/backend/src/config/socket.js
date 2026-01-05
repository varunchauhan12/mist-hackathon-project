import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ExpressError from "../middlewares/expressError";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(
          new ExpressError(401, "Authentication error: Token not provided")
        );
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return next(
          new ExpressError(401, "Authentication error: Invalid token")
        );
      }

      socket.userId = decoded.id;
      socket.role = decoded.role;
      next();
    } catch (err) {
      return next(new ExpressError(401, "Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.role); // Join room based on role
    console.log("New user connected:", socket.id);

    //socket handlers
    require("../socket/locationHandler")(io, socket);
    require("../socket/rescueChatHandler")(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
