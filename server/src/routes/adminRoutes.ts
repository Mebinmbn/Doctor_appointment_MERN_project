import express from "express";
import adminController from "../controllers/adminController";
import authMiddleware from "../middlewares/authMiddleware";
import { roleMiddleware } from "./../middlewares/authMiddleware";

const router = express.Router();

router.post("/signin", adminController.signin);

router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.applications
);

router.post(
  "/applications/approve/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.approve
);

router.post(
  "/applications/reject/:email",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.reject
);

router.get(
  "/doctors",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.doctors
);

router.put(
  "/doctors",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.edit
);

router.post(
  "/doctors/block/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.block
);

router.post(
  "/doctors/unblock/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.unblock
);

router.get(
  "/patients",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.patients
);

router.put(
  "/patients",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.edit
);

router.post(
  "/patients/block/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.block
);

router.post(
  "/patients/unblock/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.unblock
);

router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.appointments
);

export default router;
