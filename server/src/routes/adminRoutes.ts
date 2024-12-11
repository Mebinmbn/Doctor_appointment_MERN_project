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

router.post("/doctors/block/:id", authMiddleware, adminController.block);

router.post("/doctors/unblock/:id", authMiddleware, adminController.unblock);

router.get("/patients", authMiddleware, adminController.patients);

router.post("/patients/block/:id", authMiddleware, adminController.block);

router.post("/patients/unblock/:id", authMiddleware, adminController.unblock);

export default router;
