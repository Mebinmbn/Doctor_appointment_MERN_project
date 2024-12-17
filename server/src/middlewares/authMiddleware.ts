import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";

config();

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
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
    if (decoded.isBlocked) {
      res.status(401).json({ message: "Access denied" });
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

export default authMiddleware;
