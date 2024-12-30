import express from "express";
import notificationController from "../controllers/notificationController";

const router = express.Router();

router.get("/:id", notificationController.getNotifications);

router.put("/read/:id", notificationController.markAsRead);

export default router;
