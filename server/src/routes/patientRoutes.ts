import express from "express";
import patientController from "../controllers/patientController";
import { googleSignInController } from "../controllers/authController";
import authMiddleware, { roleMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", patientController.signUp);

router.post("/signin", patientController.signIn);

router.post("/google", googleSignInController);

router.post("/reset", patientController.reset);

router.post(
  "/verifyPassword",
  authMiddleware,
  roleMiddleware("user"),
  patientController.verfiyPassword
);

router.get(
  "/doctors",
  authMiddleware,
  roleMiddleware("user"),
  authMiddleware,
  patientController.doctors
);

router.get(
  "/doctors/timeSlots/:id",
  authMiddleware,
  roleMiddleware("user"),
  patientController.timeSlots
);

router.get(
  "/appointments/:id",
  authMiddleware,
  roleMiddleware("user"),
  patientController.appointments
);

router.put(
  "/appointments/cancel/:id",
  authMiddleware,
  roleMiddleware("user"),
  patientController.cancel
);

router.put(
  "/appointments/lockTimeSlot",
  authMiddleware,
  roleMiddleware("user"),
  patientController.lockTimeSlot
);

router.get(
  "/patient/:id",
  authMiddleware,
  roleMiddleware("user"),
  patientController.patient
);

router.put(
  "/patient",
  authMiddleware,
  roleMiddleware("user"),
  patientController.edit
);

router.post(
  "/appointments/patient",
  authMiddleware,
  roleMiddleware("user"),
  patientController.patientData
);

router.post(
  "/appointments/book",
  authMiddleware,
  roleMiddleware("user"),
  patientController.book
);

router.get(
  "/notifications/:id",
  authMiddleware,
  roleMiddleware("user"),
  patientController.notifications
);

router.post(
  "/payments/create-order",
  authMiddleware,
  roleMiddleware("user"),
  patientController.createOrder
);

router.post(
  "/payments/verify",
  authMiddleware,
  roleMiddleware("user"),
  patientController.verify
);

router.get("/wallet/:id", patientController.wallet);

export default router;
