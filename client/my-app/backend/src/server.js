import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import connectToDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

import authRoutes from "./routes/authRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import safeZoneRoutes from "./routes/safeZoneRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ MIDDLEWARES ------------------ */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ TEST ROUTE ------------------ */
app.get("/test", (req, res) => {
  res.send("Server is running..!!");
});

/* ------------------ DATABASE ------------------ */
await connectToDB();

/* ------------------ API ROUTES ------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/safezones", safeZoneRoutes);

/* ------------------ ERROR HANDLER ------------------ */
app.use((err, req, res, next) => {
  const status = typeof err.status === "number" ? err.status : 500;
  const message = err.message || "Internal Server Error";

  if (res.headersSent) return next(err);

  res.status(status).json({ message });
});

/* ------------------ SERVER + SOCKET ------------------ */
const server = http.createServer(app);

// initialize socket.io with auth & handlers
initSocket(server);

/* ------------------ START SERVER ------------------ */
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
