import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080";

// Create a context to hold the socket instance
const SocketContext = createContext<Socket | null>(null);

// Custom hook for consuming the socket context
export const useSocket = (): Socket | null => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn("useSocket must be used within a SocketProvider");
  }
  return socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

// Provider component to manage the socket connection
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ["websocket"], // Enforce WebSocket transport
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.io server, ID:", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.io server, Reason:", reason);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
