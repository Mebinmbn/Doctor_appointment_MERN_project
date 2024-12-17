import express from "express";
import patientController from "../controllers/patientController";
import { googleSignInController } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", patientController.signUp);

router.post("/signin", patientController.signIn);

router.post("/google", googleSignInController);

router.get("/doctors", authMiddleware, patientController.doctors);

router.post("/reset", patientController.reset);

router.get(
  "/doctors/timeSlots/:id",
  authMiddleware,
  patientController.timeSlots
);

router.put(
  "/appointments/lockTimeSlot",
  authMiddleware,
  patientController.lockTimeSlot
);

router.get(
  "/appointments/patient/:id",

  patientController.patient
);

router.post(
  "/appointments/patient",

  patientController.patientData
);

router.post("/appointments/book", authMiddleware, patientController.book);

export default router;
