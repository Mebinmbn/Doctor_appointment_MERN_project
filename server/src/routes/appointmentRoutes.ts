import express from "express";
import appointmentController from "../controllers/appointmentController";

const router = express.Router();

router.get("/:id", appointmentController.appointment);

export default router;
