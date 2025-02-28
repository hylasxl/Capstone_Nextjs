import axiosInstance from "@/lib/axios";
import { CreatePostRequest, CreatePostResponse, GetMediaStatisticRequest, GetMediaStatisticResponse, GetNewFeedRequest, GetNewFeedResponse, GetNewPostStatisticRequest, GetNewPostStatisticResponse, GetPostWMediaStatisticRequest, GetPostWMediaStatisticResponse, GetReportedPostRequest, GetReportedPostResponse, parseGetMediaStatisticRequest, parseGetMediaStatisticResponse, parseGetNewPostStatisticRequest, parseGetNewPostStatisticResponse, transformGetPostWMediaStatisticRequest, transformGetPostWMediaStatisticResponse, transformGetReportedPostRequest, transformGetReportedPostResponse } from "@/types/post.type";

export const PostService = {
    getNewPostStatistic: async (request: GetNewPostStatisticRequest): Promise<GetNewPostStatisticResponse> => {
        try {
            const parsedRequest = parseGetNewPostStatisticRequest(request);
            const response = await axiosInstance.post("/api/v1/posts/get-new-post-statistic", parsedRequest);

            return parseGetNewPostStatisticResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },
    getMediaStatistic: async (request: GetMediaStatisticRequest): Promise<GetMediaStatisticResponse> => {
        try {
            const parsedRequest = parseGetMediaStatisticRequest(request);
            const response = await axiosInstance.post("/api/v1/posts/get-media-statistic", parsedRequest);

            return parseGetMediaStatisticResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },
    getPostWMediaStatistic: async (request: GetPostWMediaStatisticRequest): Promise<GetPostWMediaStatisticResponse> => {
        try {
            const parsedRequest = transformGetPostWMediaStatisticRequest(request);
            const response = await axiosInstance.post("/api/v1/posts/get-post-w-media-statistic", parsedRequest);

            return transformGetPostWMediaStatisticResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    getReportPost: async (request: GetReportedPostRequest): Promise<GetReportedPostResponse> => {
        try {
            const parsedRequest = transformGetReportedPostRequest(request);
            console.log(parsedRequest);
            const response = await axiosInstance.post("/api/v1/moderation/get-reported-post-list", parsedRequest);
            console.log(transformGetReportedPostResponse(response.data));
            return transformGetReportedPostResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    createPost: async (request: CreatePostRequest): Promise<CreatePostResponse> => {
        try {
            const formData = new FormData()
            formData.append("content", request.content)
            formData.append("account_id", request.account_id)
            formData.append("privacy_status", request.privacy_status)
            formData.append("is_published_later", request.is_published_later)
            formData.append("published_later_timestamp", request.published_later_timestamp)
            formData.append("tag_account_ids", request.tag_account_ids)

            if (request.images) {
                request.images.forEach((image) => {
                    formData.append("medias", image);
                });
            }

            const response = await axiosInstance.post("/api/v1/posts/create-new-post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data

        } catch (error) {
            throw error;
        }
    },
    getNewFeed: async (request: GetNewFeedRequest): Promise<GetNewFeedResponse> => {
        try {
            const response = await axiosInstance.post("/api/v1/posts/get-new-feeds", request)
            return response.data
        } catch (error) {
            throw error;
        }
    }
}