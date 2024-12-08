import express from "express";
import adminController from "../controllers/adminController";

const router = express.Router();

router.post("/signin", adminController.signin);

router.get("/applications", adminController.applications);

router.post("/applications/approve/:id", adminController.approve);

router.post("/applications/reject/:email", adminController.reject);

export default router;
