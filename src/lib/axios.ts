import axios from "axios";
import { authService } from "@/services/authService";

const API_BASE_URL = "http://192.168.20.129:8080"; // Replace with your actual API URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let accessToken: string | null = null;


axiosInstance.interceptors.request.use(
    async (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors (Token Expired)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                // const newAccessToken = await authService.refreshAccessToken();
                accessToken = "a";

                // Retry original request with new token
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(error.config);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                authService.logout();
                window.location.href = "/login"; // Redirect to login
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
