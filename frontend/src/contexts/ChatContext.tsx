import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextProps {
  isOpen: boolean;
  roomId: string | null;
  userName: string | null;
  recipientId: string | null;
  openChat: (roomId: string, userName: string, recipientId: string) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  const openChat = (roomId: string, userName: string, recipientId: string) => {
    console.log("Updating chat context:", { roomId, userName, recipientId });
    setRoomId(roomId);
    setUserName(userName);
    setRecipientId(recipientId);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setRoomId(null);
    setUserName(null);
    setRecipientId(null);
  };

  return (
    <ChatContext.Provider
      value={{ isOpen, roomId, userName, recipientId, openChat, closeChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
