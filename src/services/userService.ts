import axiosInstance from "@/lib/axios";
import {
    GetAccountListRequest,
    GetAccountListResponse,
    GetNewRegisterationDataRequest,
    GetNewRegisterationDataResponse,
    GetReportedAccountListRequest,
    GetReportedAccountListResponse,
    GetUserTypeRequest,
    GetUserTypeResponse,
    parseGetNewRegisterationDataRequest,
    parseGetNewRegisterationDataResponse,
    parseGetUserTypeRequest,
    parseGetUserTypeResponse,
    ResolveBanUserRequest,
    ResolveBanUserResponse,
    SearchAccountListRequest,
    transformGetAccountListRequest,
    transformGetAccountListResponse,
    transformGetReportedAccountListRequest,
    transformGetReportedAccountListResponse,
    transformResolveBanUserRequest,
    transformResolveBanUserResponse,
    transformSeachAccountListRequest
} from "@/types/user.type";

export const UserService = {
    getNewRegisterationData: async (request: GetNewRegisterationDataRequest): Promise<GetNewRegisterationDataResponse> => {
        try {
            const parsedRequest = parseGetNewRegisterationDataRequest(request);
            const response = await axiosInstance.post("/api/v1/users/get-new-registeration-data", parsedRequest);

            return parseGetNewRegisterationDataResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    countUserType: async (request: GetUserTypeRequest): Promise<GetUserTypeResponse> => {
        try {
            const parsedRequest = parseGetUserTypeRequest(request);

            const response = await axiosInstance.post("/api/v1/users/count-user-type", parsedRequest);

            return parseGetUserTypeResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    getAccountList: async (request: GetAccountListRequest): Promise<GetAccountListResponse> => {
        try {
            const parsedRequest = transformGetAccountListRequest(request);

            const response = await axiosInstance.post("/api/v1/users/get-account-list", parsedRequest);

            return transformGetAccountListResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    searchAccountList: async (request: SearchAccountListRequest): Promise<GetAccountListResponse> => {
        try {
            const parsedRequest = transformSeachAccountListRequest(request);

            const response = await axiosInstance.post("/api/v1/users/search-account-list", parsedRequest);

            return transformGetAccountListResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    banUser: async (request: ResolveBanUserRequest): Promise<ResolveBanUserResponse> => {
        try {
            const parsedRequest = transformResolveBanUserRequest(request);

            const response = await axiosInstance.post("/api/v1/users/ban-user", parsedRequest);

            return transformResolveBanUserResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },

    getReportList: async (request: GetReportedAccountListRequest): Promise<GetReportedAccountListResponse> => {
        try {
            const parsedRequest = transformGetReportedAccountListRequest(request);

            const response = await axiosInstance.post("/api/v1/moderation/get-reported-account-list", parsedRequest);

            return transformGetReportedAccountListResponse(response.data);
        } catch (error) {
            console.error("Fetching registration data failed:", error);
            throw error;
        }
    },


};
