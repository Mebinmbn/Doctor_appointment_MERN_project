import notificationsRepository from "../repositories/notificationsRepository";

export const getAllNotifications = async (id: string) => {
  try {
    return await notificationsRepository.getNotifications(id);
  } catch (error) {
    throw new Error("Error in fetching notifications");
  }
};
