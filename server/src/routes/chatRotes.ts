import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import chatController from "../controllers/chatController";

const router = express.Router();

router.get("/:id", chatController.chat);

router.get("/rooms/:id", authMiddleware, chatController.rooms);

export default router;
