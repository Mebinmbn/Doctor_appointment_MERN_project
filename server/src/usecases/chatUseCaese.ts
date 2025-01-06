import chatRepository from "../repositories/chatRepository";

export const getChat = async (id: string) => {
  try {
    return await chatRepository.getChat(id);
  } catch (error) {
    throw new Error("Error in fetching chat");
  }
};

export const getRooms = async (id: string) => {
  try {
    return await chatRepository.getRooms(id);
  } catch (error) {
    throw new Error("Error in fetching room");
  }
};
