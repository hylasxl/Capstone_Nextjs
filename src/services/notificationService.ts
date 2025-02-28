import axiosInstance from "@/lib/axios";
import { GetNotificationRequest, GetNotificationResponse, MarkNotifcationRead, MarkNotifcationReadResponse } from "@/types/notification.type";


export const NotificationService = {
    getNotification: async (request: GetNotificationRequest): Promise<GetNotificationResponse> => {
        try {
            const response = await axiosInstance.post("/api/v1/notifications/get-notifications", request);

            return response.data
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    markRead: async (request: MarkNotifcationRead): Promise<MarkNotifcationReadResponse> => {
        try {
            const response = await axiosInstance.post("/api/v1/notifications/mark-read", request);
            return response.data
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },


}