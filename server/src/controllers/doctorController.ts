import { Request, Response } from "express";
import { registerDoctor } from "../usecases/doctorUseCases";

const register = async (req: Request, res: Response) => {
  console.log(req.file);
  try {
    if (!req.file) {
      throw new Error("license image is required");
    }

    const path = req.file?.path;
    const originName = req.file?.originalname;
    const fileName = req.file?.fieldname;

    const doctorData = {
      ...req.body,
      licenseImage: {
        filename: fileName,
        originalname: originName,
        path: path,
      },
    };

    const doctor = await registerDoctor(doctorData);
    if (doctor) {
      res
        .status(200)
        .json({ success: true, message: "Application submitted successfully" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default { register };
