import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import DoctorModel from "../models/doctorModel";
import PatientModel from "../models/patientModel";

config();

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware touched");
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("In middleware", token);
  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log("decoded", decoded);
    req.user = decoded;
    let user;
    if (decoded.role === "doctor") {
      user = await DoctorModel.findOne({ _id: decoded.id });
    } else if (decoded.role === "user") {
      user = await PatientModel.findOne({ _id: decoded.id });
    }
    if (user?.isBlocked) {
      res
        .status(403)
        .json({ message: "Your account has been blocked. Logging out.." });
      return;
    }
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      console.log("Token expired");
      res.status(401).json({ message: "Token expired" });
      return;
    }
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const roleMiddleware = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || (req.user as JwtPayload).role !== requiredRole) {
      res
        .status(403)
        .json({ message: `Access denied. Only ${requiredRole}s are allowed.` });
      return;
    }
    next();
  };
};

export default authMiddleware;
