"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextType {
    sendMessage: (msg: string) => void;
    messages: string[];
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (!ws) return;

        ws.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
        ws.onclose = () => console.log("⚠️ WebSocket Disconnected");

        return () => ws.close();
    }, [ws]);

    const connectWebSocket = (userId: number) => {
        if (ws) ws.close();
        const socket = new WebSocket(`ws://192.168.20.129:8080/ws?user_id=${userId}`);

        socket.onopen = () => console.log("✅ WebSocket Connected");
        setWs(socket);
    };

    const sendMessage = (msg: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(msg);
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error("useWebSocket must be used within WebSocketProvider");
    return context;
};
