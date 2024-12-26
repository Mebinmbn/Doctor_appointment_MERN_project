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

router.put(
  "/doctors/update/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.blockUnblock
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

router.put(
  "/patients/update/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.blockUnblock
);

router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.appointments
);

router.get(
  "/leave/requests",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.requests
);

router.put(
  "/leave/update/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.updateRequest
);

export default router;
