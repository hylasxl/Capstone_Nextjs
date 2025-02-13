import axiosInstance from "@/lib/axios";
import { AddWordRequest, AddWordResponse, DeleteWordRequest, DeleteWordResponse, EditWordRequest, EditWordResponse, GetListBanWordsRequest, GetListBanWordsResponse, transformDeleteWordRequest, transformEditWordRequest, transformGetListBanWordsRequest } from "@/types/moderation.type";


export const ModerationService = {
    getBanWord: async (request: GetListBanWordsRequest): Promise<GetListBanWordsResponse> => {
        try {
            const parsedRequest = transformGetListBanWordsRequest(request);
            const response = await axiosInstance.post("/api/v1/moderation/get-ban-list", parsedRequest);

            return response.data;
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },
    editWord: async (request: EditWordRequest): Promise<EditWordResponse> => {
        try {
            const parsedRequest = transformEditWordRequest(request);
            const response = await axiosInstance.post("/api/v1/moderation/edit-word", parsedRequest);

            return response.data;
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },
    deleteWord: async (request: DeleteWordRequest): Promise<DeleteWordResponse> => {
        try {
            const parsedRequest = transformDeleteWordRequest(request);
            const response = await axiosInstance.post("/api/v1/moderation/delete-word", parsedRequest);

            return response.data;
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },
    addWord: async (request: AddWordRequest): Promise<AddWordResponse> => {
        try {
            const response = await axiosInstance.post("/api/v1/moderation/add-word", request);

            return response.data;
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },
}