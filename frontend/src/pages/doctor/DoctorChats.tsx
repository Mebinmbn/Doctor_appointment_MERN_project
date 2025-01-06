import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useChat } from "../../contexts/ChatContext";

interface ChatRoom {
  _id: string;
  latestMessage: {
    sender: string;
    senderId: string;
    recipientId: string;
    text: string;
    timestamp: string;
    roomId: string;
  };
}

const DoctorChats: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const { openChat } = useChat();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await api.get(`/chats/rooms/${doctor?.id}`, {
          headers: { "User-Type": "doctor" },
        });
        setChatRooms(response.data.rooms);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, [doctor?.id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Patient Chats</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {chatRooms.length === 0 ? (
          <p className="p-4 text-gray-600">No chats available.</p>
        ) : (
          <ul>
            {chatRooms.map((room) => (
              <li
                key={room._id}
                className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div
                  className="flex justify-between items-center"
                  onClick={() =>
                    openChat(
                      room.latestMessage.roomId,
                      doctor?.name || "Doctor",
                      room.latestMessage.senderId,
                      room.latestMessage.sender,
                      room.latestMessage.recipientId
                    )
                  }
                >
                  <div>
                    <h2 className="font-semibold text-lg">
                      {room.latestMessage.sender}
                    </h2>
                    <p className="text-gray-600 text-sm truncate">
                      {room.latestMessage.text}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(room.latestMessage.timestamp).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorChats;
