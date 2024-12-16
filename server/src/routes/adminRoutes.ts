import express from "express";
import adminController from "../controllers/adminController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signin", adminController.signin);

router.get("/applications", authMiddleware, adminController.applications);

router.post(
  "/applications/approve/:id",
  authMiddleware,
  adminController.approve
);

router.post(
  "/applications/reject/:email",
  authMiddleware,
  adminController.reject
);

router.get("/doctors", authMiddleware, adminController.doctors);

router.put("/doctors", authMiddleware, adminController.edit);

router.post("/doctors/block/:id", authMiddleware, adminController.block);

router.post("/doctors/unblock/:id", authMiddleware, adminController.unblock);

router.get("/patients", authMiddleware, adminController.patients);

router.put("/patients", authMiddleware, adminController.edit);

router.post("/patients/block/:id", authMiddleware, adminController.block);

router.post("/patients/unblock/:id", authMiddleware, adminController.unblock);

router.get("/appointments", adminController.appointments);

export default router;
