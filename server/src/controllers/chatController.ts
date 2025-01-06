import express, { Request, Response } from "express";
import { getChat, getRooms } from "../usecases/chatUseCaese";

const chat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await getChat(id);
    if (chat) {
      res
        .status(200)
        .json({ success: true, chat, message: "Chat fetched successfully" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const rooms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rooms = await getRooms(id);
    if (rooms) {
      res
        .status(200)
        .json({ success: true, rooms, message: "Rooms feteched successfully" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default { chat, rooms };
