import notificationsRepository from "../repositories/notificationsRepository";

export const getAllNotifications = async (id: string) => {
  try {
    return await notificationsRepository.getNotifications(id);
  } catch (error) {
    throw new Error("Error in fetching notifications");
  }
};

export const markNotificationsAsRead = async (id: string) => {
  try {
    return await notificationsRepository.markAsRead(id);
  } catch (error) {
    throw new Error("Error in marking as read");
  }
};
