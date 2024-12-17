import express from "express";
import doctorController from "../controllers/doctorController";
import upload from "../services/multerService";

const router = express.Router();

router.post(
  "/register",
  upload.single("licenseImage"),
  doctorController.register
);

router.post("/signin", doctorController.signin);

router.get("/appointments/:id", doctorController.appointments);

router.put("/appointments/approve/:id", doctorController.approve);

router.put("/appointments/reject/:id", doctorController.reject);

router.get("/timeSlots/:id", doctorController.timeSlots);

router.put("/timeSlots", doctorController.removeTimeSlots);

export default router;
