import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useSocket } from "../../contexts/SocketContexts";
import PatientSideBar from "../../components/patient/PatientSideBar";

interface ChatRoom {
  _id: string;
  latestMessage: {
    sender: string;
    receiver: string;
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

const Chats: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const user = useSelector((state: RootState) => state.user.user);
  const socket = useSocket();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await api.get(`/chats/rooms/${user?.id}`, {
          headers: { "User-Type": "patient" },
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

    if (user?.id) fetchChatRooms();
  }, [user?.id, messages]);

  useEffect(() => {
    if (!selectedRoom) return;

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
      const roomId = selectedRoom.latestMessage.roomId;
      socket.emit("join", roomId);

      const handleMessageReceive = (data: Message) => {
        if (data.sender !== user?.name) {
          setMessages((prev) => [...prev, data]);
        }
      };

      socket.on("receiveMessage", handleMessageReceive);

      return () => {
        socket.off("receiveMessage", handleMessageReceive);
        socket.emit("leave", roomId);
      };
    }
  }, [selectedRoom, socket, user?.name]);

  const handleSendMessage = () => {
    if (!socket || !selectedRoom || !inputMessage.trim()) return;

    const message: Message = {
      sender: user?.name || "Unknown",
      text: inputMessage,
      timeStamp: new Date(),
    };

    socket.emit("sendMessage", {
      ...message,
      room: selectedRoom.latestMessage.roomId,
      recipientId: selectedRoom.latestMessage.senderId,
      senderId: user?.id,
    });

    setMessages((prev) => [...prev, message]);
    setInputMessage("");
  };

  const renderChatRooms = () =>
    chatRooms.map((room) => (
      <li
        key={room._id}
        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
          selectedRoom?.latestMessage.roomId === room.latestMessage.roomId
            ? "bg-gray-100"
            : ""
        }`}
        onClick={() => setSelectedRoom(room)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">
              {room.latestMessage.sender === user?.name
                ? room.latestMessage.receiver
                : room.latestMessage.sender}
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
    ));

  const renderMessages = () =>
    messages.map((msg, index) => (
      <div
        key={index}
        className={`flex ${
          msg.sender === user?.name ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`p-3 rounded-lg shadow-md ${
            msg.sender === user?.name
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
    ));

  return (
    <div className="md:flex bg-[#007E85] justify-between">
      <PatientSideBar />
      <div
        className={`${
          selectedRoom ? "hidden" : "block"
        } w-full  bg-white shadow-md h-screen overflow-auto p-5`}
      >
        <h1 className="text-2xl font-bold p-4 border-b">Doctor Chats</h1>
        <ul>
          {chatRooms.length === 0 ? (
            <p>No chats available.</p>
          ) : (
            renderChatRooms()
          )}
        </ul>
      </div>
      <div className="flex-1 flex flex-col bg-white shadow-md h-screen">
        {selectedRoom && (
          <>
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Chat with{" "}
                {selectedRoom.latestMessage.sender === user?.name
                  ? selectedRoom.latestMessage.receiver
                  : selectedRoom.latestMessage.sender}
              </h2>
              <button
                className="text-gray-500"
                onClick={() => setSelectedRoom(null)}
              >
                X
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-600">No messages yet.</p>
              ) : (
                renderMessages()
              )}
            </div>
            <div className="p-4 border-t flex items-center">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
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
        )}
      </div>
    </div>
  );
};

export default Chats;
