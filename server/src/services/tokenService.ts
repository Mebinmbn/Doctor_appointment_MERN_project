import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const generateToken = (
  userId: string,
  userRole: string,
  userIsBlocked: boolean
): string => {
  return jwt.sign(
    { id: userId, role: userRole, isBlocked: userIsBlocked },
    "mysorebank",
    { expiresIn: "1h" }
  );
};
