import axiosInstance from "@/lib/axios";
import { LoginRequest, LoginResponse, LoginWithGoogleRequest, parseLoginResponse } from "@/types/auth.type";

export const authService = {
    loginWithUsername: async (request: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await axiosInstance.post("/api/v1/authentication/login", request)

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("user", JSON.stringify(response.data.userId));

            return parseLoginResponse(response.data);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },

    loginWithGoogle: async (request: LoginWithGoogleRequest): Promise<LoginResponse> => {
        try {
            const response = await axiosInstance.post("/api/v1/users/login-with-google", request);

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("user", JSON.stringify(response.data.userId));

            return parseLoginResponse(response.data);
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    },


    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
    },
};
