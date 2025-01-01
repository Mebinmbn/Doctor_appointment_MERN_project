import express from "express";
import medicalRecordController from "../controllers/medicalRecordController";

const router = express.Router();

router.get("/:id", medicalRecordController.getRecord);

export default router;
