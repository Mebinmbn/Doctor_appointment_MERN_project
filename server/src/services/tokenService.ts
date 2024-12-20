import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const generateToken = (
  userId: string,
  userRole: string,
  userIsBlocked: boolean
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not defined");
  }
  console.log(secret);
  return jwt.sign(
    { id: userId, role: userRole, isBlocked: userIsBlocked },
    secret,
    { expiresIn: "1h" }
  );
};
