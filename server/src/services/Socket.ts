import { Server } from "socket.io";
import { Application } from "express";
import ChatModel from "../models/chatModel";

interface SignalData {
  type: string;
  roomId: string;
  caller: string;
  offer?: RTCSessionDescription;
  answer?: RTCSessionDescription;
  candidate?: RTCIceCandidate;
}

interface User {
  socketId: string;
  status: string;
}

export const setupSocketIO = (server: any, app: Application) => {
  const io = new Server(server, {
    cors: {
      origin: "https://doctor-appointment-mern-project-t13k.vercel.app",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "User-Type"],
    },
  });

  app.set("io", io);

  const onlineUsers: { [key: string]: User } = {};

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("join", (room: string, userId: string) => {
      try {
        socket.join(room);
        onlineUsers[userId] = { socketId: socket.id, status: "online" };
        io.emit("userStatusChange", onlineUsers);
        console.log(`Client ${socket.id} joined room: ${room}`);
        socket.to(room).emit("user-connected", socket.id);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("signal", (data: SignalData) => {
      try {
        if (data.type === "end-call") {
          socket.to(data.roomId).emit("call-ended", { caller: data.caller });
        } else {
          io.to(data.roomId).emit("signal", data);
          console.log("Signaling data emitted:", data);
        }
      } catch (error) {
        console.error("Error handling signal:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
      console.log("message received", data.text);
      const { room, sender, text, timeStamp, recipientId, senderId } = data;
      const message = {
        sender,
        text,
        timeStamp,
      };
      console.log(message);
      const newMessage = {
        roomId: room,
        sender,
        senderId,
        recipientId,
        text,
        timeStamp,
      };
      const newChat = new ChatModel(newMessage);
      await newChat.save();
      io.to(room).emit("receiveMessage", message);
      io.to(recipientId).emit("chatNotification", {
        room,
        message,
        senderId,
      });

      console.log(
        `Message sent to room: ${room}, and notification to: ${recipientId} , ${message}`
      );
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);

      for (const [userId, user] of Object.entries(onlineUsers)) {
        if (user.socketId === socket.id) {
          delete onlineUsers[userId];
          io.emit("userStatusChange", onlineUsers);
          break;
        }
      }
      socket.rooms.forEach((room: string) => {
        socket.to(room).emit("user-disconnected", socket.id);
      });
    });
  });

  return io;
};
