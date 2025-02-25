import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { useSocket } from "../contexts/SocketContexts";
import api from "../api/api";

interface Message {
  sender: string;
  text: string;
  timeStamp: string;
}

const ChatPage: React.FC = () => {
  const {
    isOpen,
    roomId,
    userName,
    recipientId,
    recipientName,
    senderId,
    closeChat,
  } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [recipientStatus, setRecipientStatus] = useState<string | null>(null);
  const socket = useSocket();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const fetchChat = async () => {
    try {
      const response = await api.get(`/chats/${roomId}`);
      setMessages(response.data.chat);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("join", roomId, senderId);
      fetchChat();

      const handleMessageReceive = (data: Message) => {
        if (data.sender !== userName) {
          setMessages((prev) => [...prev, data]);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleUserStatusChange = (users: any) => {
        if (recipientId)
          if (users[recipientId]?.status) {
            setRecipientStatus(users[recipientId].status);
          }
      };

      socket.on("receiveMessage", handleMessageReceive);
      socket.on("userStatusChange", handleUserStatusChange);

      return () => {
        socket.off("receiveMessage", handleMessageReceive);
        socket.emit("leave", roomId);
      };
    }
  }, [roomId, socket]);

  const handleSendMessage = () => {
    if (socket && roomId && userName) {
      const message: Message = {
        sender: userName,
        text: inputMessage,
        timeStamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", {
        ...message,
        room: roomId,
        recipientId,
        senderId,
      });
      setMessages((prev) => [...prev, message]);
      setInputMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ zIndex: 999 }}
    >
      <div className="bg-blue-600 text-white p-3 cursor-pointer flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          {recipientName}
          {recipientStatus && (
            <span
              className={`ml-2 text-sm ${
                recipientStatus === "online" ? "text-green-500" : "text-red-500"
              }`}
            >
              ({recipientStatus})
            </span>
          )}
        </h1>
        <button onClick={closeChat} className="text-xl">
          ×
        </button>
      </div>
      <div className="flex flex-col h-96">
        <div className="flex-1 p-3 overflow-y-auto space-y-4 bg-gray-100">
          {messages.map((msg, index) => {
            if (!msg) return null;

            return (
              <div
                key={index}
                className={`flex ${
                  msg.sender === userName ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md ${
                    msg.sender === userName
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p className="font-bold">{msg.sender}</p>
                  <p>{msg.text}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timeStamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={lastMessageRef} />
        </div>
        <div className="p-3 bg-white border-t border-gray-300">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
