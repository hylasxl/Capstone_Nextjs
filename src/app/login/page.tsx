"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { LoginRequest } from "@/types/auth.type";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
    const { loginWithUsername } = useAuth();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUsernameLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError("Username and password are required.");
            return;
        }
        setError("");
        try {
            const request: LoginRequest = {
                username: formData.username,
                password: formData.password
            };
            const response = await authService.loginWithUsername(request);

            loginWithUsername(Number(response.userId), Number(response.jwtClaims?.roleId), response.accessToken, response.refreshToken);
            console.log(response)
            if (response.success) {
                router.push("/newfeed");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-96 shadow-xl">
                <CardHeader className="flex flex-col items-center">
                    <Image src="/app_icon.png" alt="App Logo" width={50} height={50} className="mb-2" />
                    <CardTitle className="text-center text-primary text-2xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                    <form onSubmit={handleUsernameLogin} className="space-y-4">
                        <Input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                    <div className="text-right mt-4">
                        <a href="#" className="text-sm text-gray-500 hover:underline" style={{ opacity: 0.5 }} onClick={() => {
                            router.push("/login/forget-password")
                        }}>Forgot Password?</a>
                    </div>
                    <div className="text-center mt-2">
                        <Button variant="outline" className="w-full" onClick={() => {
                            router.push("/login/register")
                        }}>Register</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}