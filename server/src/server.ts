import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database";
import cors from "cors";
import logger from "./config/logger";
import patientRoutes from "./routes/patientRoutes";
import otpRoutes from "./routes/otpRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import adminRoutes from "./routes/adminRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import tokenRouter from "./routes/tokenRoutes";
import appointmentRouter from "./routes/appointmentRoutes";
import medicalRecordRoute from "./routes/medicalRecordRoute";
import chatRoutes from "./routes/chatRotes";
import path from "path";
import { createServer } from "http";
import { setupSocketIO } from "./services/Socket";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const server = createServer(app);

setupSocketIO(server, app);

dbConnect();

app.use(
  cors({
    credentials: true,
    origin: "https://doctor-appointment-mern-project-opal.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "User-Type"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/patients", patientRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/token", tokenRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/medicalRecord", medicalRecordRoute);
app.use("/api/chats", chatRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
