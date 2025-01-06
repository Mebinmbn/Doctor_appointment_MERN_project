import ChatModel from "../models/chatModel";

const getChat = async (id: string) => {
  try {
    const chat = await ChatModel.find({ roomId: id });
    return chat;
  } catch (error) {
    throw new Error("Error in fetching chat");
  }
};

const getRooms = async (id: string) => {
  try {
    const rooms = await ChatModel.aggregate([
      { $match: { recipientId: id } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$roomId",
          latestMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    console.log(rooms);

    return rooms;
  } catch (error) {
    throw new Error("Error in fetching rooms");
  }
};

export default { getChat, getRooms };
