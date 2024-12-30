import { Server } from "socket.io";
import { Application } from "express";

interface SignalData {
  type: string;
  roomId: string;
  caller: string; // Add the caller property
  offer?: RTCSessionDescription;
  answer?: RTCSessionDescription;
  candidate?: RTCIceCandidate;
}

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

    // Join a room
    socket.on("join", (room: string) => {
      try {
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
        socket.to(room).emit("user-connected", socket.id); // Notify others in the room
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    // Signal event for WebRTC (Offer/Answer/ICE Candidate)
    socket.on("signal", (data: SignalData) => {
      try {
        if (data.type === "end-call") {
          // Handle the end of the call, notifying other users or cleaning up the room
          socket.to(data.roomId).emit("call-ended", { caller: data.caller });
        } else {
          // Emit the signaling data (offer, answer, candidate) to the room
          io.to(data.roomId).emit("signal", data);
          console.log("Signaling data emitted:", data);
        }
      } catch (error) {
        console.error("Error handling signal:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);

      // Notify other clients in the room that the user has disconnected
      socket.rooms.forEach((room: string) => {
        socket.to(room).emit("user-disconnected", socket.id);
      });
    });
  });

  return io;
};
