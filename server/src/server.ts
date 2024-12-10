import express, { Request, Response } from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database";
import cors from "cors";
import patientRoutes from "./routes/patientRoutes";
import otpRoutes from "./routes/otpRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import adminRoutes from "./routes/adminRoutes";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

dbConnect();
//////////////////////////////////////////////////////
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/patients", patientRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
