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
      {
        $match: {
          $or: [{ recipientId: id }, { senderId: id }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            senderId: {
              $cond: [{ $eq: ["$senderId", id] }, "$recipientId", "$senderId"],
            },
          },
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
