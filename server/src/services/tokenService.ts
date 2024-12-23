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
    { expiresIn: "30m" }
  );
};

export const generateRefreshToken = (
  userId: string,
  userRole: string,
  userIsBlocked: boolean
): string => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshSecret) {
    throw new Error("REFRESH_TOKEN_SECRET not defined");
  }
  return jwt.sign(
    { id: userId, role: userRole, isBlocked: userIsBlocked },
    refreshSecret,
    { expiresIn: "7d" }
  );
};
