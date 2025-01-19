import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useSocket } from "../../contexts/SocketContexts";
import DoctorNav from "../../components/doctor/DoctorNav";

interface ChatRoom {
  _id: string;
  latestMessage: {
    sender: string;
    senderId: string;
    recipientId: string;
    text: string;
    timeStamp: string;
    roomId: string;
  };
}

interface Message {
  sender: string;
  text: string;
  timeStamp: Date;
}

const DoctorChats: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const socket = useSocket();

  const fetchChatRooms = async () => {
    try {
      const response = await api.get(`/chats/rooms/${doctor?.id}`, {
        headers: { "User-Type": "doctor" },
      });
      const sortedRooms = response.data.rooms.sort(
        (a: ChatRoom, b: ChatRoom) =>
          new Date(b.latestMessage.timeStamp).getTime() -
          new Date(a.latestMessage.timeStamp).getTime()
      );

      setChatRooms(sortedRooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [doctor?.id]);

  useEffect(() => {
    if (selectedRoom?.latestMessage.roomId) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(
            `/chats/${selectedRoom.latestMessage.roomId}`
          );
          setMessages(response.data.chat);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();

      if (socket) {
        socket.emit("join", selectedRoom.latestMessage.roomId);

        const handleMessageReceive = (data: Message) => {
          if (data.sender !== doctor?.name) {
            setMessages((prev) => [...prev, data]);
            fetchChatRooms();
          }
        };

        socket.on("receiveMessage", handleMessageReceive);

        return () => {
          socket.off("receiveMessage", handleMessageReceive);
          socket.emit("leave", selectedRoom.latestMessage.roomId);
        };
      }
    }
  }, [selectedRoom, socket, doctor?.name]);

  const handleSendMessage = () => {
    if (socket && selectedRoom?.latestMessage.roomId && doctor?.name) {
      const message: Message = {
        sender: doctor.name,
        text: inputMessage,
        timeStamp: new Date(),
      };

      socket.emit("sendMessage", {
        ...message,
        room: selectedRoom.latestMessage.roomId,
        recipientId: selectedRoom.latestMessage.senderId,
        senderId: doctor.id,
      });

      setMessages((prev) => [...prev, message]);
      setInputMessage("");
    }
  };

  return (
    <div className="md:flex  bg-[#007E85]">
      <DoctorNav />

      <div className="w-full md:w-1/3 md:ml-5 bg-white shadow-md ">
        <h1 className="text-2xl font-bold p-4 border-b">Patient Chats</h1>
        <ul>
          {chatRooms.length === 0 ? (
            <p className="p-4 text-gray-600">No chats available.</p>
          ) : (
            chatRooms.map((room) => (
              <li
                key={room._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedRoom?.latestMessage.roomId ===
                  room.latestMessage.roomId
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {room.latestMessage.sender}
                    </h2>
                    <p className="text-gray-600 text-sm truncate">
                      {room.latestMessage.text}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(room.latestMessage.timeStamp).toLocaleString()}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="flex-1 flex flex-col bg-white shadow-md  h-screen min-h-screen">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Chat with {selectedRoom.latestMessage.sender}
              </h2>
              <button
                className="text-red-500"
                onClick={() => setSelectedRoom(null)}
              >
                Close
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
              {messages.length === 0 ? (
                <p className="text-gray-600">No messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === doctor?.name
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg shadow-md ${
                        msg.sender === doctor?.name
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
                ))
              )}
            </div>
            <div className="p-4 border-t flex items-center bg-white">
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
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-600">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChats;
