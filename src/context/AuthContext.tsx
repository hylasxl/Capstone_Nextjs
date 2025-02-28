"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/lib/axios";
import WebSocketService from "@/services/webSocketService";

interface User {
    id: number;
    roleID: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loginWithUsername: (id: number, roleID: number, accessToken: string, refreshToken: string) => void;
    loginWithGoogle: (id: number, roleID: number, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        if (storedUser && isAuthenticated === "true") {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            refreshAccessToken();
            WebSocketService.connect(parsedUser.id);
        }
    }, []);

    const refreshAccessToken = async () => {
        try {
        } catch (error) {
            console.error("Token refresh failed:", error);
            logout();
        }
    };

    const loginWithUsername = (id: number, roleID: number, accessToken: string, refreshToken: string) => {
        const user: User = { id, roleID };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("isAuthenticated", "true");
        setAccessToken(accessToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

        setUser(user);
        setIsAuthenticated(true);
        WebSocketService.connect(id); // 🔹 Connect WebSocket on login
    };

    const loginWithGoogle = (id: number, roleID: number, accessToken: string, refreshToken: string) => {
        loginWithUsername(id, roleID, accessToken, refreshToken);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("accessToken");

        setUser(null);
        setIsAuthenticated(false);
        setAccessToken(null);
        delete axiosInstance.defaults.headers.Authorization;

        WebSocketService.disconnect();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loginWithUsername, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
