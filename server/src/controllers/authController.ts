import { Request, Response } from "express";
import { googleSignIn } from "../usecases/googleSignInUseCase";

export const googleSignInController = async (req: Request, res: Response) => {
  try {
    console.log("Reached controller");
    const token = req.body;
    console.log(token);
    const { patient, jwtoken } = await googleSignIn(token.token);
    res.status(200).json({
      success: true,
      token: jwtoken,
      user: { name: patient.firstName, role: patient.role, id: patient._id },
      message: "Successfully Logged in",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};
