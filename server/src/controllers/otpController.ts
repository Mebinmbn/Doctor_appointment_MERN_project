import { Request, Response } from "express";
import { sendVerificationEmail, verifyEmail } from "../usecases/otpUsecases";
import { emailService } from "../services/emailService";

export const sendVerification = async (req: Request, res: Response) => {
  console.log("otpcontroller");
  try {
    const { email } = req.body;
    console.log(email);
    await sendVerificationEmail(email, emailService);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { email, otp, userType } = req.body;
    console.log(email, otp, userType);
    const isVerified = await verifyEmail(email, otp, userType);
    if (isVerified) {
      res.status(200).json({ success: true, message: "Email verified" });
    } else {
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
