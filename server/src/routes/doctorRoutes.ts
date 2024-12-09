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

export default router;
