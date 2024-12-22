import { Server } from "socket.io";
import { Application } from "express";

export const setupSocketIO = (server: any, app: Application) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "User-Type"],
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};
