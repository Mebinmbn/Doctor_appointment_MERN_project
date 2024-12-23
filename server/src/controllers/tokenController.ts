import express, { Request, Response } from "express";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { generateToken } from "../services/tokenService";

config();

interface User {
  id: string;
  role: string;
  isBlocked: boolean;
}

const refreshtoken = (req: Request, res: Response): void => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Received refreshToken:", refreshToken);
    if (!refreshToken) {
      res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
      return; // Ensure to return after sending the response
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: any, user: any) => {
        if (err) {
          console.error("Error verifying refresh token:", err);
          res
            .status(403)
            .json({ success: false, message: "Invalid refresh token" });
          return; // Ensure to return after sending the response
        }

        const token = generateToken(user.id, user.role, user.isBlocked);
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Error in refreshtoken function:", error);
    res.status(400).json({ success: false, message: "An error occurred" });
  }
};

export default { refreshtoken };
