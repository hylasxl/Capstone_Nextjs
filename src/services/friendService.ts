import axiosInstance from "@/lib/axios";
import { GetListFriendRequest, GetListFriendResponse } from "@/types/friend.type";

export const friendService = {
    getListFriend: async (request: GetListFriendRequest): Promise<GetListFriendResponse> => {
        try {
            const response = await axiosInstance.post("/api/v1/friends/get-list-friend", request)

            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },


};
