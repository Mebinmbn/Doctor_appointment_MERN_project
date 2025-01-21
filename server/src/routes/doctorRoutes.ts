import express from "express";
import doctorController from "../controllers/doctorController";
import upload from "../services/multerService";
import authMiddleware, { roleMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/register",
  upload.single("licenseImage"),
  doctorController.register
);

router.post("/signin", doctorController.signin);

router.get(
  "/appointments/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.appointments
);

router.put(
  "/appointments/cancel/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.cancel
);

// router.put("/appointments/reject/:id", doctorController.reject);

router.post(
  "/timeSlots/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.createTimeSlots
);

router.get(
  "/timeSlots/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.timeSlots
);

router.put(
  "/timeSlots/:doctorId/:date",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.removeTimeSlots
);

router.get(
  "/notifications/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.notifications
);

router.post(
  "/leave/apply",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.leave
);

router.get(
  "/leaves/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.getleaves
);

router.post(
  "/medicalRecord",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.medicalRecord
);

router.get(
  "/dashboard/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.dashboard
);

router.get(
  "/payments/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  doctorController.payments
);

export default router;
