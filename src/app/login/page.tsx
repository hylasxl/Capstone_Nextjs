"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { LoginRequest } from "@/types/auth.type";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { loginWithUsername } = useAuth();
    const [formData, setFormData] = useState({ username: "", password: "" });

    const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUsernameLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const request: LoginRequest = {
                username: formData.username,
                password: formData.password
            }
            const response = await authService.loginWithUsername(request);

            loginWithUsername(Number(response.userId), Number(response.jwtClaims?.roleId), response.accessToken, response.refreshToken);
            if (response.success) {
                router.push("/dashboard/user")
            }
            console.log("Login successful:", response);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-primary mb-4">Login</h2>
                <form onSubmit={handleUsernameLogin}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg">
                        Login with Username
                    </button>
                </form>
            </div>
        </div>
    );
}
