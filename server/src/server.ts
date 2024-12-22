import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database";
import cors from "cors";
import patientRoutes from "./routes/patientRoutes";
import otpRoutes from "./routes/otpRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import adminRoutes from "./routes/adminRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketIO } from "./services/Socket";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//HTTP server
const server = createServer(app);

setupSocketIO(server, app);

// Database connection
dbConnect();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "User-Type"],
  })
);
app.use(express.json());

// static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notification", notificationRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
