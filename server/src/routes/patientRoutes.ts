import express from "express";
import patientController from "../controllers/patientController";
import { googleSignInController } from "../controllers/authController";

const router = express.Router();

router.post("/signup", patientController.signUp);

router.post("/signin", patientController.signIn);

router.post("/google", googleSignInController);

router.get("/doctors", patientController.doctors);

export default router;
